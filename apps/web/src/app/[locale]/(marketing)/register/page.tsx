"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/components/Link";
import { Container } from "@/components/Section";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { ApiError, resendVerification } from "@/lib/api";
import { useLocale } from "@/lib/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();
  const { register, verifyEmail } = useAuth();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { userId: newUserId } = await register({
        email,
        password,
        fullName,
        termsAccepted,
        marketingConsent: false,
      });
      setUserId(newUserId);
      setStep("verify");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setError(null);
    setSubmitting(true);
    try {
      await verifyEmail(userId, code);
      router.push(`/${locale}/app/dashboard`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!userId) return;
    setError(null);
    setNotice(null);
    try {
      await resendVerification(userId);
      setNotice(`We sent a new verification code to ${email}.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend the code. Please try again.");
    }
  }

  if (step === "verify") {
    return (
      <Container className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-sm rounded-[10px] border border-neutral-300 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-neutral-900">Verify your email</h1>
          <p className="mt-1 text-sm text-neutral-500">
            We sent a 6-digit code to {email}. Enter it below to activate your account.
          </p>
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleVerify}>
            {error ? (
              <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p>
            ) : null}
            {notice ? <p className="rounded-md bg-success-100 px-3 py-2 text-sm text-success-600">{notice}</p> : null}
            <div className="flex flex-col gap-1">
              <label htmlFor="code" className="text-sm font-semibold text-neutral-900">
                Verification code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm tracking-widest focus:outline-2 focus:outline-primary-600"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Verifying…" : "Verify & Continue"}
            </Button>
            <button type="button" onClick={handleResend} className="text-center text-sm font-semibold text-primary-700">
              Resend code
            </button>
          </form>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-[10px] border border-neutral-300 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-neutral-900">Create your account</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Start your treatment application in minutes.
        </p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleRegister}>
          {error ? (
            <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p>
          ) : null}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold text-neutral-900">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-neutral-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-semibold text-neutral-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={10}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <label className="flex items-start gap-2 text-xs text-neutral-600">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <span>
              I agree to the{" "}
              <Link href="/terms-of-service" className="font-semibold text-primary-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="font-semibold text-primary-700">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Create Account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-700">
            Log in
          </Link>
        </p>
      </div>
    </Container>
  );
}
