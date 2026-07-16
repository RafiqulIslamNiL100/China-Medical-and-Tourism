"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Section";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { ApiError, resendVerification } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login, verifyEmail } = useAuth();
  const [step, setStep] = useState<"login" | "verify">("login");
  const [unverifiedUserId, setUnverifiedUserId] = useState<string | null>(null);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(emailOrPhone, password);
      router.push("/app/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.code === "EMAIL_NOT_VERIFIED") {
        const userId = err.details?.userId;
        if (typeof userId === "string") {
          setUnverifiedUserId(userId);
          setStep("verify");
          try {
            await resendVerification(userId);
            setNotice(`We sent a new verification code to ${emailOrPhone}.`);
          } catch {
            setNotice("Enter the verification code we originally sent you, or request a new one below.");
          }
          return;
        }
      }
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!unverifiedUserId) return;
    setError(null);
    setSubmitting(true);
    try {
      await verifyEmail(unverifiedUserId, code);
      router.push("/app/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!unverifiedUserId) return;
    setError(null);
    setNotice(null);
    try {
      await resendVerification(unverifiedUserId);
      setNotice(`We sent a new verification code to ${emailOrPhone}.`);
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
            Your account isn&apos;t verified yet. Enter the 6-digit code we sent to {emailOrPhone}.
          </p>
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleVerify}>
            {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}
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
            <button
              type="button"
              onClick={handleResend}
              className="text-center text-sm font-semibold text-primary-700"
            >
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
        <h1 className="text-xl font-bold text-neutral-900">Log in to your account</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Access your case, messages, and itinerary.
        </p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p>
          ) : null}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-neutral-900">
              Email or phone
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-semibold text-neutral-900">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-primary-700">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Logging in…" : "Log In"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary-700">
            Register
          </Link>
        </p>
      </div>
    </Container>
  );
}
