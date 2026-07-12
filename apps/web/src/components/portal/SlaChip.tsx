import { Badge } from "@/components/Badge";

export type SlaRisk = "on-track" | "at-risk" | "breached";

const toneByRisk: Record<SlaRisk, "success" | "warning" | "danger"> = {
  "on-track": "success",
  "at-risk": "warning",
  breached: "danger",
};

const labelByRisk: Record<SlaRisk, string> = {
  "on-track": "On track",
  "at-risk": "Due soon",
  breached: "Overdue",
};

export function SlaChip({ risk }: { risk: SlaRisk }) {
  return <Badge tone={toneByRisk[risk]}>{labelByRisk[risk]}</Badge>;
}
