import Link from "next/link";
import { formatCurrency } from "@/lib/utils/currency";
import { formatEventDate } from "@/lib/utils/dates";
import type { EventOverview } from "@/types/event";
import { StatusBadge } from "@/components/common/status-badge";

export function EventHero({ event }: { event: EventOverview }) {
  return (
    <section className="hero-panel stack">
      <div className="toolbar">
        <div className="eyebrow">Event overview</div>
        <StatusBadge status={event.status} />
      </div>
      <div className="stack">
        <h1 className="section-title">{event.title}</h1>
        <p className="lede">
          {event.venueName || "Venue to be decided"} · {formatEventDate(event.occurredAt)}
        </p>
      </div>
      <div className="inline-list">
        <div className="stat-card stack">
          <span className="muted">Current bill</span>
          <strong>{formatCurrency(event.totalAmount, event.currency)}</strong>
        </div>
        <div className="stat-card stack">
          <span className="muted">People</span>
          <strong>{event.participantCount}</strong>
        </div>
        <div className="stat-card stack">
          <span className="muted">Joined</span>
          <strong>{event.joinedCount}</strong>
        </div>
        <div className="stat-card stack">
          <span className="muted">Unresolved</span>
          <strong>{event.unresolvedCount}</strong>
        </div>
      </div>
      <div className="button-row">
        <Link className="button" href={`/event/${event.shareToken}/claim`}>
          Claim items
        </Link>
        <Link className="button-secondary" href={`/event/${event.shareToken}/summary`}>
          View summary
        </Link>
        <Link className="button-ghost" href={`/event/${event.shareToken}/host`}>
          Host dashboard
        </Link>
      </div>
    </section>
  );
}
