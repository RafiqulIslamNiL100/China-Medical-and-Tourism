import { Badge } from "@/components/Badge";
import type { CaseStatus } from "@/data/patient";

const toneByStatus: Record<CaseStatus, "neutral" | "info" | "warning" | "success" | "danger" | "primary"> = {
  Submitted: "neutral",
  "Under Review": "info",
  "Info Requested": "warning",
  Accepted: "success",
  Declined: "danger",
  Completed: "primary",
};

export function StatusChip({ status }: { status: CaseStatus }) {
  return <Badge tone={toneByStatus[status]}>{status}</Badge>;
}
