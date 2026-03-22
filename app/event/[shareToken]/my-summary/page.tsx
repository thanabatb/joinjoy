import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { HistoryBackButton } from "@/components/common/history-back-button";
import { listClaimsByEventId } from "@/lib/repositories/claims";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { listItemsByShareToken } from "@/lib/repositories/items";
import { getSummaryByShareToken } from "@/lib/repositories/payments";
import { listParticipantsByShareToken } from "@/lib/repositories/participants";
import { getParticipantSessionCookieName } from "@/lib/session/participant-session";
import { formatCurrency } from "@/lib/utils/currency";
import { normalizeShareToken } from "@/lib/utils/share-token";
import type { Participant } from "@/types/participant";

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

function getItemIcon(name: string) {
  const value = name.toLowerCase();

  if (
    value.includes("fries") ||
    value.includes("slider") ||
    value.includes("beef") ||
    value.includes("burger")
  ) {
    return "food";
  }

  if (value.includes("cocktail") || value.includes("negroni") || value.includes("beer")) {
    return "drink";
  }

  return "bill";
}

function PersonalSummaryIcon({ icon }: { icon: string }) {
  if (icon === "food") {
    return (
      <svg aria-hidden="true" className="member-summary-item-svg" fill="none" viewBox="0 0 24 24">
        <path
          d="M7 4v7M10 4v7M7 8h3M15 4v16M17.5 4c0 3-1.5 4.5-3 5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (icon === "drink") {
    return (
      <svg aria-hidden="true" className="member-summary-item-svg" fill="none" viewBox="0 0 24 24">
        <path
          d="M6 5h12l-4.5 5.5v5L10.5 18v-7.5L6 5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="member-summary-item-svg" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 4.5h8l3 3V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14 4.5v3h3M9 11h6M9 15h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default async function MySummaryPage({
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

  const [participants, items, claims, summary, cookieStore] = await Promise.all([
    listParticipantsByShareToken(shareToken),
    listItemsByShareToken(shareToken),
    listClaimsByEventId(event.id),
    getSummaryByShareToken(shareToken),
    cookies()
  ]);

  const participantId = cookieStore.get(getParticipantSessionCookieName(shareToken))?.value ?? null;
  const viewerParticipant =
    participants.find((participant) => participant.id === participantId && participant.joinedAt) ?? null;

  if (!viewerParticipant) {
    redirect(`/event/${shareToken}/join`);
  }

  const viewerSummary = summary?.participants.find(
    (participant) => participant.participantId === viewerParticipant.id
  );
  const itemClaimsByItemId = new Map<string, typeof claims>();

  for (const claim of claims) {
    const current = itemClaimsByItemId.get(claim.itemId) ?? [];
    current.push(claim);
    itemClaimsByItemId.set(claim.itemId, current);
  }

  const viewerItems = items.flatMap((item) => {
    const itemClaims = itemClaimsByItemId.get(item.id) ?? [];
    const viewerClaim = itemClaims.find((claim) => claim.participantId === viewerParticipant.id);

    if (!viewerClaim) {
      return [];
    }

    return [
      {
        id: item.id,
        name: item.name,
        amount: viewerClaim.splitAmount,
        type: itemClaims.length > 1 ? ("shared" as const) : ("personal" as const),
        icon: getItemIcon(item.name),
        sharingParticipants: itemClaims
          .map((claim) => participants.find((participant) => participant.id === claim.participantId))
          .filter((participant): participant is Participant => Boolean(participant))
      }
    ];
  });

  const subtotal = viewerSummary?.finalSubtotal ?? viewerSummary?.subtotal ?? 0;
  const serviceCharge =
    viewerSummary?.finalServiceCharge ?? viewerSummary?.estimatedServiceCharge ?? 0;
  const vat = viewerSummary?.finalVat ?? viewerSummary?.estimatedVat ?? 0;
  const total = viewerSummary?.finalTotal ?? viewerSummary?.estimatedTotal ?? 0;
  const totalLabel = summary?.isFinal ? "Final Total" : "Estimated Total";
  const canPayNow = (event.status === "finalized" || event.status === "settled") && total > 0;

  return (
    <>
      <main className="page-shell member-summary-page">
        <header className="event-summary-topbar">
          <div className="event-summary-topbar-row">
            <HistoryBackButton
              ariaLabel="Back to event"
              className="create-back"
              fallbackHref={`/event/${shareToken}/summary`}
            >
              <span>←</span>
            </HistoryBackButton>
            <h1 className="event-summary-topbar-title">Your Summary</h1>
          </div>
          <button className="member-summary-topbar-dot" type="button">
            ⋯
          </button>
        </header>

        <section className="member-summary-context-card">
          <div className="member-summary-context-icon">◎</div>
          <div className="stack" style={{ gap: 4 }}>
            <h2 className="member-summary-context-title">{event.title}</h2>
            <p className="member-summary-context-meta">
              {event.venueName || "Venue pending"} •{" "}
              {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
                new Date(event.occurredAt)
              )}
            </p>
          </div>
        </section>

        <section className="member-summary-card">
          <div className="member-summary-card-glow" />
          <div className="member-summary-heading">
            <div className="stack" style={{ gap: 6 }}>
              <h3 className="member-summary-title">Your Summary</h3>
              <p className="member-summary-note">
                {viewerItems.length} {viewerItems.length === 1 ? "item" : "items"} claimed
              </p>
            </div>
            <div className="member-summary-avatar-badge">{getInitials(viewerParticipant.displayName)}</div>
          </div>

          {viewerItems.length > 0 ? (
            <div className="member-summary-item-list">
              {viewerItems.map((item) => (
                <article className="member-summary-item-row" key={item.id}>
                  <div className="member-summary-item-main">
                    <div className="member-summary-item-icon">
                      <PersonalSummaryIcon icon={item.icon} />
                    </div>
                    <div className="stack" style={{ gap: 6 }}>
                      <strong>{item.name}</strong>
                      {item.type === "shared" ? (
                        <div className="member-summary-shared-meta">
                          <span className="member-summary-chip shared">Shared</span>
                          <div className="member-summary-avatar-stack">
                            {item.sharingParticipants.slice(0, 3).map((participant, index) => (
                              <div
                                className={`member-summary-avatar tone-${getAvatarTone(index)}`}
                                key={participant.id}
                              >
                                {getInitials(participant.displayName)}
                              </div>
                            ))}
                            {item.sharingParticipants.length > 3 ? (
                              <div className="member-summary-avatar tone-muted">
                                +{item.sharingParticipants.length - 3}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <span className="member-summary-chip">Personal</span>
                      )}
                    </div>
                  </div>
                  <strong className="member-summary-item-amount">
                    {formatCurrency(item.amount, event.currency)}
                  </strong>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <strong>No items claimed yet</strong>
              <p className="muted" style={{ margin: "8px 0 0" }}>
                Claim an item first, then your running total will show up here.
              </p>
            </div>
          )}

          <div className="member-summary-breakdown">
            <div className="detail-row">
              <span className="muted">Subtotal</span>
              <strong>{formatCurrency(subtotal, event.currency)}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">
                Service Charge
                {event.serviceChargeType === "percentage" ? ` (${event.serviceChargeRate}%)` : ""}
              </span>
              <strong>{formatCurrency(serviceCharge, event.currency)}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">
                VAT
                {event.vatType === "percentage" ? ` (${event.vatRate}%)` : ""}
              </span>
              <strong>{formatCurrency(vat, event.currency)}</strong>
            </div>
          </div>

          <div className="member-summary-total">
            <div className="stack" style={{ gap: 4 }}>
              <span className="member-summary-total-label">{totalLabel}</span>
              <strong className="member-summary-total-amount">
                {formatCurrency(total, event.currency)}
              </strong>
            </div>
            <div className="member-summary-total-mark">✓</div>
          </div>
        </section>

        <section className="member-summary-actions">
          {canPayNow ? (
            <Link className="button member-summary-primary" href={`/event/${shareToken}/payment`}>
              Pay Now
            </Link>
          ) : null}
          <Link
            className={canPayNow ? "button-secondary member-summary-secondary" : "button member-summary-primary"}
            href={`/event/${shareToken}/summary`}
          >
            Back to Event
          </Link>
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
          <span>Owed</span>
        </div>
        <div className="event-summary-nav-item">
          <span>Profile</span>
        </div>
      </nav>
    </>
  );
}
