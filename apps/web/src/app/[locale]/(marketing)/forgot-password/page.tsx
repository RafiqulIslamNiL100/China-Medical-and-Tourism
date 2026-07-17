"use client";

import { useState } from "react";
import { Link } from "@/components/Link";
import { Container } from "@/components/Section";
import { Button } from "@/components/Button";
import { ApiError, forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(emailOrPhone);
      // Always show the same confirmation, whether or not an account exists for
      // this email/phone — the backend behaves identically for both cases so we
      // never reveal which accounts exist.
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Container className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-sm rounded-[10px] border border-neutral-300 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600">
            ✓
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Check your email</h1>
          <p className="mt-2 text-sm text-neutral-600">
            If an account exists for <span className="font-semibold">{emailOrPhone}</span>, we&apos;ve sent a link
            to reset your password. The link expires in 30 minutes.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-primary-700">
            Back to log in
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-[10px] border border-neutral-300 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-neutral-900">Forgot your password?</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter the email or phone number on your account and we&apos;ll send you a link to reset it.
        </p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}
          <div className="flex flex-col gap-1">
            <label htmlFor="emailOrPhone" className="text-sm font-semibold text-neutral-900">
              Email or phone
            </label>
            <input
              id="emailOrPhone"
              name="emailOrPhone"
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-600">
          <Link href="/login" className="font-semibold text-primary-700">
            Back to log in
          </Link>
        </p>
      </div>
    </Container>
  );
}
