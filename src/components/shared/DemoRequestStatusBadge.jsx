import { Badge } from "@/components/ui/Badge";

const statusConfig = {
  PENDING: { label: "Pending", variant: "warning" },
  APPROVED: { label: "Approved", variant: "success" },
  RESCHEDULED: { label: "Rescheduled", variant: "success" },
  DECLINED: { label: "Declined", variant: "danger" },
  CANCELLED: { label: "Cancelled", variant: "default" },
};

export function DemoRequestStatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, variant: "default" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
