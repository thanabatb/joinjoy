import { formatCurrency } from "@/lib/utils/currency";
import type { PayoutMethod } from "@/types/event";

export function PayoutInfoCard({
  payout,
  amount,
  currency
}: {
  payout?: PayoutMethod;
  amount?: number;
  currency: string;
}) {
  return (
    <section className="card stack">
      <div className="toolbar">
        <h2 className="section-title">Payment info</h2>
        <span className="eyebrow">Screen 13</span>
      </div>
      {amount !== undefined ? (
        <div className="detail-row">
          <span className="muted">Amount due</span>
          <strong>{formatCurrency(amount, currency)}</strong>
        </div>
      ) : null}
      {payout ? (
        <div className="detail-list">
          <div className="detail-row">
            <span className="muted">Recipient</span>
            <strong>{payout.recipientName}</strong>
          </div>
          <div className="detail-row">
            <span className="muted">Payout type</span>
            <strong>{payout.payoutType.replaceAll("_", " ")}</strong>
          </div>
          <div className="detail-row">
            <span className="muted">Bank</span>
            <strong>{payout.bankName || "Not set"}</strong>
          </div>
          <div className="detail-row">
            <span className="muted">Account number</span>
            <strong>{payout.accountNumber || "Not set"}</strong>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <strong>No payout method yet</strong>
        </div>
      )}
    </section>
  );
}
