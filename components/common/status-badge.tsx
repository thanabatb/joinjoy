import { eventStatusLabels, itemStatusLabels, paymentStatusLabels } from "@/lib/utils/statuses";

function humanizeStatus(status: string) {
  return (
    eventStatusLabels[status] ??
    itemStatusLabels[status] ??
    paymentStatusLabels[status] ??
    status.replaceAll("_", " ")
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge ${status}`}>{humanizeStatus(status)}</span>;
}
