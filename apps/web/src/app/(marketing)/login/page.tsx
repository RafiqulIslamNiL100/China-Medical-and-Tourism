import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Section";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-[10px] border border-neutral-300 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-neutral-900">Log in to your account</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Access your case, messages, and itinerary.
        </p>
        <form className="mt-6 flex flex-col gap-4">
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
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <Button type="submit" className="w-full">
            Log In
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
