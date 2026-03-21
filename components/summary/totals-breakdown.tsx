import { formatCurrency } from "@/lib/utils/currency";

export function TotalsBreakdown({
  subtotal,
  serviceCharge,
  vat,
  total,
  currency,
  label
}: {
  subtotal: number;
  serviceCharge: number;
  vat: number;
  total: number;
  currency: string;
  label: string;
}) {
  return (
    <section className="card stack">
      <div className="toolbar">
        <h2 className="section-title">{label}</h2>
      </div>
      <div className="detail-list">
        <div className="detail-row">
          <span className="muted">Items subtotal</span>
          <strong>{formatCurrency(subtotal, currency)}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">Service charge</span>
          <strong>{formatCurrency(serviceCharge, currency)}</strong>
        </div>
        <div className="detail-row">
          <span className="muted">VAT</span>
          <strong>{formatCurrency(vat, currency)}</strong>
        </div>
        <div className="divider" />
        <div className="detail-row">
          <span className="muted">Total due</span>
          <strong>{formatCurrency(total, currency)}</strong>
        </div>
      </div>
    </section>
  );
}
