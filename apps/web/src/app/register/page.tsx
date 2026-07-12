import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Section";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-[10px] border border-neutral-300 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-neutral-900">Create your account</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Start your treatment application in minutes.
        </p>
        <form className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold text-neutral-900">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-neutral-900">
              Email or phone
            </label>
            <input
              id="email"
              name="email"
              type="text"
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
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <label className="flex items-start gap-2 text-xs text-neutral-600">
            <input type="checkbox" className="mt-0.5" />
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
          <Button type="submit" className="w-full">
            Create Account
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
