/**
 * Rotates the passwords of the seeded demo accounts and revokes their active sessions.
 *
 * Run this against any environment where seed.js was run with the default (publicly
 * known) password — especially production:
 *
 *   NEW_PASSWORD='a-strong-new-password' node database/prisma/rotate-demo-passwords.js
 *
 * In the Railway console (DATABASE_URL is already in the environment there):
 *
 *   NEW_PASSWORD='a-strong-new-password' node database/prisma/rotate-demo-passwords.js
 */
const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");

const DEMO_EMAILS = [
  "sarah.chen@asiahealthlink.com",
  "jing.zhao@buf-hospital.cn",
  "ex-staff@buf-hospital.cn",
  "li.wei@asiahealthlink.com",
  "zhang.wei@drivers.cmt.com",
  "sun.li@interpreters.cmt.com",
  "bookings@riverside-suites.cn",
  "amara.nwosu@example.com",
  "farrukh.tashkentov@example.com",
  "grace.otieno@example.com",
  "michael.asante@example.com",
];

const prisma = new PrismaClient();

async function main() {
  const newPassword = process.env.NEW_PASSWORD;
  if (!newPassword || newPassword.length < 10) {
    console.error("Set NEW_PASSWORD (min 10 characters). Nothing was changed.");
    process.exitCode = 1;
    return;
  }

  const passwordHash = await argon2.hash(newPassword);

  const users = await prisma.user.findMany({
    where: { email: { in: DEMO_EMAILS } },
    select: { id: true, email: true },
  });
  if (users.length === 0) {
    console.log("No demo accounts found — nothing to rotate.");
    return;
  }

  const userIds = users.map((u) => u.id);
  const [updated, revoked] = await prisma.$transaction([
    prisma.user.updateMany({ where: { id: { in: userIds } }, data: { passwordHash } }),
    prisma.session.updateMany({
      where: { userId: { in: userIds }, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  console.log(`Rotated ${updated.count} demo account password(s); revoked ${revoked.count} active session(s):`);
  for (const u of users) console.log(`  ${u.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
