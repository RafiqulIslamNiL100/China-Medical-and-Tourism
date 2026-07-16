/**
 * End-to-end smoke test: boots the built server (dist/main.js) against DATABASE_URL,
 * then drives the real HTTP API through the core patient journey — register, OTP
 * verify (code captured from the dev email stand-in's console output), login, /me,
 * hospital search, application submission — plus the key negative cases (401 without
 * a token, 401 on a bad password).
 *
 * Prerequisites: `nest build` has run, migrations are applied, and the database is
 * seeded (application submission needs a Published hospital to route to).
 * No test-framework dependencies — plain Node + fetch; exits non-zero on failure.
 *
 * Usage: DATABASE_URL=... node test/smoke.mjs   (or `npm test` with env set)
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const apiRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = process.env.SMOKE_PORT ?? "3999";
const BASE = `http://localhost:${PORT}/v1`;

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`  ok    ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL must be set.");
    process.exit(1);
  }

  console.log("Booting server...");
  let serverOutput = "";
  const server = spawn("node", ["dist/main.js"], {
    cwd: apiRoot,
    env: {
      ...process.env,
      PORT,
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "smoke-test-access-secret-0123456789",
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "smoke-test-refresh-secret-9876543210",
    },
  });
  server.stdout.on("data", (chunk) => (serverOutput += chunk.toString()));
  server.stderr.on("data", (chunk) => (serverOutput += chunk.toString()));
  const stopServer = () => {
    if (!server.killed) server.kill("SIGTERM");
  };
  process.on("exit", stopServer);

  let healthy = false;
  for (let i = 0; i < 30; i++) {
    await sleep(1000);
    try {
      const res = await fetch(`http://localhost:${PORT}/health`);
      if (res.ok) {
        healthy = true;
        break;
      }
    } catch {
      /* not up yet */
    }
  }
  if (!healthy) {
    console.error("Server never became healthy. Output:\n" + serverOutput.slice(-3000));
    process.exit(1);
  }
  console.log("Server healthy. Running checks...");

  const email = `smoke_${Date.now()}@example.com`;
  const password = "SmokeTest!Passw0rd";

  // --- register -------------------------------------------------------------
  const registerRes = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      fullName: "Smoke Test",
      termsAccepted: true,
      marketingConsent: false,
    }),
  });
  const registerBody = await registerRes.json();
  check("register returns 201 with user id", registerRes.status === 201 && !!registerBody.user?.id, JSON.stringify(registerBody).slice(0, 200));
  const userId = registerBody.user?.id;

  // --- OTP captured from the dev email stand-in's log ------------------------
  await sleep(500);
  const otpMatch = serverOutput.match(new RegExp(`${email}[^\\n]*verification code is (\\d{6})`));
  check("OTP code appears in email dispatch log", !!otpMatch);

  // --- login before verifying must be rejected, not silently allowed --------------
  const unverifiedLoginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrPhone: email, password }),
  });
  const unverifiedLoginBody = await unverifiedLoginRes.json();
  check(
    "login before email verification is rejected (EMAIL_NOT_VERIFIED)",
    unverifiedLoginRes.status === 403 && unverifiedLoginBody.error?.code === "EMAIL_NOT_VERIFIED",
    JSON.stringify(unverifiedLoginBody).slice(0, 200),
  );

  // --- resend-verification issues a new code, invalidating the first ---------------
  let latestOtpMatch = otpMatch;
  if (userId) {
    const resendRes = await fetch(`${BASE}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    check("resend-verification returns 204", resendRes.status === 204);
    await sleep(500);
    const allMatches = [...serverOutput.matchAll(new RegExp(`${email}[^\\n]*verification code is (\\d{6})`, "g"))];
    latestOtpMatch = allMatches.length > 0 ? allMatches[allMatches.length - 1] : otpMatch;
    check("resend-verification issued a second, different code", allMatches.length >= 2 && latestOtpMatch[1] !== otpMatch?.[1]);
  }

  // --- verify → tokens --------------------------------------------------------
  let accessToken = "";
  if (userId && latestOtpMatch) {
    const verifyRes = await fetch(`${BASE}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, code: latestOtpMatch[1] }),
    });
    const verifyBody = await verifyRes.json();
    check("verify returns access+refresh tokens", !!verifyBody.accessToken && !!verifyBody.refreshToken, JSON.stringify(verifyBody).slice(0, 200));
    accessToken = verifyBody.accessToken ?? "";
  }

  // --- login after verifying now succeeds ------------------------------------------
  const verifiedLoginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrPhone: email, password }),
  });
  check("login after email verification succeeds", verifiedLoginRes.status === 200);

  // --- /me with and without token ---------------------------------------------
  const meRes = await fetch(`${BASE}/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
  const meBody = await meRes.json();
  check("/me returns the registered user", meRes.status === 200 && meBody.email === email, JSON.stringify(meBody).slice(0, 200));

  const meNoToken = await fetch(`${BASE}/me`);
  check("/me without token is 401", meNoToken.status === 401);

  // --- bad password rejected ----------------------------------------------------
  const badLogin = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrPhone: email, password: "definitely-wrong-1" }),
  });
  check("login with wrong password is 401", badLogin.status === 401);

  // --- public hospital search ----------------------------------------------------
  const hospitalsRes = await fetch(`${BASE}/hospitals`);
  const hospitalsBody = await hospitalsRes.json();
  check(
    "public hospital search returns seeded data",
    hospitalsRes.status === 200 && Array.isArray(hospitalsBody.data) && hospitalsBody.data.length > 0,
    `status ${hospitalsRes.status}, ${hospitalsBody.data?.length ?? 0} hospitals`,
  );

  // --- application submission -------------------------------------------------------
  const applyRes = await fetch(`${BASE}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      specialtySlug: "cardiology",
      conditionSummary: "Smoke test condition",
      consentToProcessMedicalData: true,
    }),
  });
  const applyBody = await applyRes.json();
  check(
    "application submission creates a case with refNumber",
    applyRes.status === 201 && !!applyBody.refNumber,
    JSON.stringify(applyBody).slice(0, 200),
  );

  const listRes = await fetch(`${BASE}/applications`, { headers: { Authorization: `Bearer ${accessToken}` } });
  const listBody = await listRes.json();
  check(
    "patient sees exactly their own case",
    listRes.status === 200 && listBody.data?.length === 1 && listBody.data[0].refNumber === applyBody.refNumber,
    JSON.stringify(listBody.meta ?? listBody).slice(0, 200),
  );

  // --- cleanup: remove everything this run created --------------------------------
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    if (applyBody.id) await prisma.application.delete({ where: { id: applyBody.id } }).catch(() => {});
    if (userId) await prisma.user.delete({ where: { id: userId } }).catch(() => {});
  } finally {
    await prisma.$disconnect();
  }

  stopServer();
  console.log(failures === 0 ? "\nAll smoke checks passed." : `\n${failures} smoke check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
