import type { Metadata } from "next";
import { ApplicationWizard } from "@/components/portal/ApplicationWizard";

export const metadata: Metadata = { title: "New Application" };

export default function ApplyPage() {
  return <ApplicationWizard />;
}
