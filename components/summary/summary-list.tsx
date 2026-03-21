import { StatusBadge } from "@/components/common/status-badge";
import { formatCurrency } from "@/lib/utils/currency";
import type { EventSummaryResponse } from "@/types/api";

export function SummaryList({
  summary,
  currency
}: {
  summary: EventSummaryResponse;
  currency: string;
}) {
  return (
    <section className="card stack">
      <div className="toolbar">
        <h2 className="section-title">{summary.isFinal ? "Final summary" : "Estimated summary"}</h2>
        <StatusBadge status={summary.isFinal ? "finalized" : "claiming"} />
      </div>
      <div className="stack">
        {summary.participants.map((participant) => {
          const total = summary.isFinal ? participant.finalTotal ?? 0 : participant.estimatedTotal ?? 0;

          return (
            <div className="detail-row" key={participant.participantId}>
              <div className="stack" style={{ gap: 4 }}>
                <strong>{participant.displayName}</strong>
                <span className="muted">
                  {summary.isFinal
                    ? `Subtotal ${formatCurrency(participant.finalSubtotal ?? 0, currency)}`
                    : `Subtotal ${formatCurrency(participant.subtotal ?? 0, currency)}`}
                </span>
              </div>
              <strong>{formatCurrency(total, currency)}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
