import type { EventOverview } from "@/types/event";

export function EventProgress({ event }: { event: EventOverview }) {
  const resolved = Math.max(event.itemCount - event.unresolvedCount, 0);
  const percentage = event.itemCount === 0 ? 0 : Math.round((resolved / event.itemCount) * 100);

  return (
    <section className="card stack">
      <div className="toolbar">
        <h2 className="section-title">Progress</h2>
        <strong>{percentage}%</strong>
      </div>
      <div
        style={{
          height: 12,
          borderRadius: 999,
          overflow: "hidden",
          background: "rgba(20, 53, 47, 0.08)"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)"
          }}
        />
      </div>
      <div className="metric-list">
        <div className="metric-row">
          <span className="muted">Claimed or resolved items</span>
          <strong>
            {resolved}/{event.itemCount}
          </strong>
        </div>
        <div className="metric-row">
          <span className="muted">Joined participants</span>
          <strong>
            {event.joinedCount}/{event.participantCount}
          </strong>
        </div>
      </div>
    </section>
  );
}
