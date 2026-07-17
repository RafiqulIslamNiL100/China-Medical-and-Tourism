"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/components/Link";
import { Container } from "@/components/Section";
import { Button } from "@/components/Button";
import { ApiError, resetPassword } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="w-full max-w-sm rounded-[10px] border border-neutral-300 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-neutral-900">Invalid reset link</h1>
        <p className="mt-2 text-sm text-neutral-600">
          This password reset link is missing its token. Request a new one below.
        </p>
        <Link href="/forgot-password" className="mt-6 inline-block text-sm font-semibold text-primary-700">
          Request a new link
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="w-full max-w-sm rounded-[10px] border border-neutral-300 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600">
          ✓
        </div>
        <h1 className="text-xl font-bold text-neutral-900">Password updated</h1>
        <p className="mt-2 text-sm text-neutral-600">
          You&apos;ve been signed out of all devices for security. Log in with your new password.
        </p>
        <Button href="/login" className="mt-6 w-full">
          Log In
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ resetToken: token!, newPassword });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-[10px] border border-neutral-300 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-bold text-neutral-900">Set a new password</h1>
      <p className="mt-1 text-sm text-neutral-500">Choose a new password for your account.</p>
      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}
        <div className="flex flex-col gap-1">
          <label htmlFor="newPassword" className="text-sm font-semibold text-neutral-900">
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={10}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
          />
          <p className="text-xs text-neutral-500">At least 10 characters.</p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-neutral-900">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={10}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
          />
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Updating…" : "Update Password"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <Suspense fallback={<p className="text-sm text-neutral-500">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </Container>
  );
}
