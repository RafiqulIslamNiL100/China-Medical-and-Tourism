import { Badge } from "@/components/Badge";
import type { IncomingApplication } from "@/data/hospitalStaff";

const toneByRisk: Record<IncomingApplication["slaRisk"], "success" | "warning" | "danger"> = {
  "on-track": "success",
  "at-risk": "warning",
  breached: "danger",
};

const labelByRisk: Record<IncomingApplication["slaRisk"], string> = {
  "on-track": "On track",
  "at-risk": "Due soon",
  breached: "Overdue",
};

export function SlaChip({ risk }: { risk: IncomingApplication["slaRisk"] }) {
  return <Badge tone={toneByRisk[risk]}>{labelByRisk[risk]}</Badge>;
}
