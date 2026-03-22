import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { HistoryBackButton } from "@/components/common/history-back-button";
import { ShareActions } from "@/components/event/share-actions";
import { SummaryItemList } from "@/components/event/summary-item-list";
import { listClaimsByEventId } from "@/lib/repositories/claims";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { listItemsByShareToken } from "@/lib/repositories/items";
import { listParticipantsByShareToken } from "@/lib/repositories/participants";
import { getParticipantSessionCookieName } from "@/lib/session/participant-session";
import { normalizeShareToken } from "@/lib/utils/share-token";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getAvatarTone(index: number) {
  const tones = ["primary", "secondary", "tertiary", "amber"] as const;
  return tones[index % tones.length];
}

export default async function EventSummaryPage({
  params
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken: rawShareToken } = await params;
  const shareToken = normalizeShareToken(rawShareToken);
  const event = await getEventOverviewByShareToken(shareToken);

  if (!event) {
    notFound();
  }

  const participants = await listParticipantsByShareToken(shareToken);
  const items = await listItemsByShareToken(shareToken);
  const claims = await listClaimsByEventId(event.id);
  const cookieStore = await cookies();
  const participantId = cookieStore.get(getParticipantSessionCookieName(shareToken))?.value ?? null;
  const totalAmountText = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(event.totalAmount);

  const joinedParticipants = participants.filter((participant) => participant.joinedAt);
  const viewerParticipant =
    participants.find((participant) => participant.id === participantId && participant.joinedAt) ?? null;

  if (!viewerParticipant) {
    redirect(`/event/${shareToken}/join`);
  }

  const resolvedItems = items.filter((item) => item.status !== "unclaimed").length;
  const progress = items.length === 0 ? 0 : Math.round((resolvedItems / items.length) * 100);

  return (
    <>
      <main className="page-shell event-summary-page">
        <header className="event-summary-topbar">
          <div className="event-summary-topbar-row">
            <HistoryBackButton
              ariaLabel="Go back"
              className="create-back"
              fallbackHref="/"
            >
              <span>←</span>
            </HistoryBackButton>
            <h1 className="event-summary-topbar-title">Event Details</h1>
          </div>
          <ShareActions shareToken={shareToken} variant="icon" />
        </header>

        <section className="event-summary-hero-card">
          <div className="event-summary-hero-top">
            <div className="stack" style={{ gap: 6 }}>
              <h2 className="event-summary-title">{event.title}</h2>
              <span className="status-badge claiming event-summary-status-badge">Claiming</span>
            </div>
            <div className="event-summary-host-avatar">{getInitials(event.hostName)}</div>
          </div>

          <div className="event-summary-meta-grid">
            <div className="event-summary-meta-row">
              <span className="event-summary-meta-icon">⌖</span>
              <span>{event.venueName || "Venue pending"}</span>
            </div>
            <div className="event-summary-meta-row">
              <span className="event-summary-meta-icon">○</span>
              <span>
                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
                  new Date(event.occurredAt)
                )}
              </span>
            </div>
          </div>

          <div className="event-summary-host-row">
            <span className="muted">
              Hosted by <strong className="event-summary-host-name">{event.hostName}</strong>
            </span>
          </div>
        </section>

        <section className="event-summary-total-card">
          <span className="event-summary-total-label">Total Bill</span>
          <div className="event-summary-total-value">
            <strong className="event-summary-total-amount">{totalAmountText}</strong>
            <span className="event-summary-total-currency">{event.currency}</span>
          </div>
        </section>

        <section className="stack" style={{ gap: 12 }}>
          <div className="event-summary-progress-header">
            <h3 className="event-summary-section-title">Claimed Items</h3>
            <span className="event-summary-progress-note">
              {resolvedItems} of {items.length} items
            </span>
          </div>
          <div className="event-summary-progress-track">
            <div className="event-summary-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="event-summary-participation-grid">
          <div className="event-summary-stat-card">
            <div className="stack" style={{ gap: 10 }}>
              <p className="event-summary-stat-label">Joined</p>
              <div className="event-summary-avatar-stack">
                {joinedParticipants.slice(0, 4).map((participant, index) => (
                  <div
                    className={`event-summary-avatar tone-${getAvatarTone(index)}`}
                    key={participant.id}
                  >
                    {getInitials(participant.displayName)}
                  </div>
                ))}
                {joinedParticipants.length > 4 ? (
                  <div className="event-summary-avatar tone-muted">
                    +{joinedParticipants.length - 4}
                  </div>
                ) : null}
              </div>
            </div>
            <strong className="event-summary-stat-number">
              {String(joinedParticipants.length).padStart(2, "0")}
            </strong>
          </div>
        </section>

        {viewerParticipant.isHost ? (
          <section className="event-summary-host-actions">
            <Link className="event-summary-review-totals" href={`/event/${shareToken}/host`}>
              Review totals
            </Link>
          </section>
        ) : null}

        <section className="stack" style={{ gap: 16 }}>
          <h3 className="event-summary-list-title">Bill Items</h3>
          <SummaryItemList
            claims={claims}
            currency={event.currency}
            items={items}
            participants={participants}
            viewerParticipantId={viewerParticipant?.id ?? null}
          />
        </section>
      </main>

      <nav className="event-summary-bottom-nav">
        <Link className="event-summary-nav-item" href="/">
          <span>Home</span>
        </Link>
        <div className="event-summary-nav-item active">
          <span>Events</span>
        </div>
        <div className="event-summary-nav-item">
          <span>Alerts</span>
        </div>
        <div className="event-summary-nav-item">
          <span>Profile</span>
        </div>
      </nav>
    </>
  );
}
