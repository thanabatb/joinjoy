import { formatCurrency } from "@/lib/utils/currency";
import type { Item } from "@/types/item";
import { StatusBadge } from "@/components/common/status-badge";

export function ItemCard({
  item,
  currency,
  actionHint
}: {
  item: Item;
  currency: string;
  actionHint?: string;
}) {
  return (
    <article className="item-card">
      <div className="toolbar">
        <div className="stack" style={{ gap: 4 }}>
          <strong>{item.name}</strong>
          <span className="muted">
            Qty {item.quantity} · {item.assignmentMode.replaceAll("_", " ")}
          </span>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="detail-row">
        <span className="muted">Item total</span>
        <strong>{formatCurrency(item.totalPrice, currency)}</strong>
      </div>
      {actionHint ? <span className="split-note">{actionHint}</span> : null}
    </article>
  );
}
