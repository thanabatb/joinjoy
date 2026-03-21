import { StatusBadge } from "@/components/common/status-badge";
import { formatCurrency } from "@/lib/utils/currency";

export function PaymentStatusList({
  rows,
  currency
}: {
  rows: Array<{
    participantId: string;
    displayName: string;
    finalTotal: number;
    paymentStatus: string;
  }>;
  currency: string;
}) {
  return (
    <section className="card stack">
      <div className="toolbar">
        <h2 className="section-title">Payment status</h2>
        <span className="eyebrow">Screen 14</span>
      </div>
      <div className="stack">
        {rows.map((row) => (
          <div className="detail-row" key={row.participantId}>
            <div className="stack" style={{ gap: 4 }}>
              <strong>{row.displayName}</strong>
              <span className="muted">{formatCurrency(row.finalTotal, currency)}</span>
            </div>
            <StatusBadge status={row.paymentStatus} />
          </div>
        ))}
      </div>
    </section>
  );
}
