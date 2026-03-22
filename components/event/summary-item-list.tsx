"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { splitItemEvenly } from "@/lib/calculations/split-item";
import { formatCurrency } from "@/lib/utils/currency";
import type { ItemClaim } from "@/types/claim";
import type { Item } from "@/types/item";
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

  if (value.includes("fries") || value.includes("slider") || value.includes("beef")) {
    return "restaurant";
  }

  if (value.includes("cocktail") || value.includes("negroni") || value.includes("beer")) {
    return "local_bar";
  }

  if (value.includes("water")) {
    return "water_drop";
  }

  return "receipt_long";
}

function EventSummaryIcon({ icon }: { icon: string }) {
  if (icon === "restaurant") {
    return (
      <svg aria-hidden="true" className="event-summary-item-svg" fill="none" viewBox="0 0 24 24">
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

  if (icon === "local_bar") {
    return (
      <svg aria-hidden="true" className="event-summary-item-svg" fill="none" viewBox="0 0 24 24">
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

  if (icon === "water_drop") {
    return (
      <svg aria-hidden="true" className="event-summary-item-svg" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 4c3 4 5 6.6 5 9.2A5 5 0 1 1 7 13.2C7 10.6 9 8 12 4Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="event-summary-item-svg" fill="none" viewBox="0 0 24 24">
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

export function SummaryItemList({
  claims,
  currency,
  items,
  participants,
  viewerParticipantId
}: {
  claims: ItemClaim[];
  currency: string;
  items: Item[];
  participants: Participant[];
  viewerParticipantId: string | null;
}) {
  const router = useRouter();
  const [claimRows, setClaimRows] = useState(claims);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  const participantsById = useMemo(
    () => Object.fromEntries(participants.map((participant) => [participant.id, participant])),
    [participants]
  );

  function buildOptimisticClaims(item: Item, participantIds: string[]) {
    const now = new Date().toISOString();

    return splitItemEvenly(item.totalPrice, participantIds).map((entry) => ({
      id: `local-${item.id}-${entry.participantId}`,
      eventId: item.eventId,
      itemId: item.id,
      participantId: entry.participantId,
      splitAmount: entry.splitAmount,
      splitRatio: entry.splitRatio,
      createdByType: "participant" as const,
      createdAt: now,
      updatedAt: now
    }));
  }

  async function handleClaim(item: Item) {
    if (!viewerParticipantId || pendingItemId) {
      return;
    }

    setPendingItemId(item.id);

    try {
      const response = await fetch(`/api/items/${item.id}/claims`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: viewerParticipantId })
      });

      if (!response.ok) {
        return;
      }

      setClaimRows((current) => {
        const itemClaims = current.filter((claim) => claim.itemId === item.id);
        const participantIds = Array.from(
          new Set([
            ...itemClaims.map((claim) => claim.participantId),
            viewerParticipantId
          ])
        );

        return [
          ...current.filter((claim) => claim.itemId !== item.id),
          ...buildOptimisticClaims(item, participantIds)
        ];
      });
      router.refresh();
    } finally {
      setPendingItemId(null);
    }
  }

  async function handleUnclaim(itemId: string) {
    if (pendingItemId) {
      return;
    }

    setPendingItemId(itemId);

    try {
      const response = await fetch(`/api/items/${itemId}/clear-claims`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: viewerParticipantId })
      });

      if (!response.ok) {
        return;
      }

      setClaimRows((current) => {
        const targetItem = items.find((item) => item.id === itemId);

        if (!targetItem || !viewerParticipantId) {
          return current;
        }

        const remainingParticipantIds = current
          .filter((claim) => claim.itemId === itemId)
          .map((claim) => claim.participantId)
          .filter((participantId) => participantId !== viewerParticipantId);

        return [
          ...current.filter((claim) => claim.itemId !== itemId),
          ...buildOptimisticClaims(targetItem, remainingParticipantIds)
        ];
      });
      router.refresh();
    } finally {
      setPendingItemId(null);
    }
  }

  return (
    <div className="event-summary-items">
      {items.map((item) => {
        const itemClaims = claimRows.filter((claim) => claim.itemId === item.id);
        const claimParticipants = itemClaims
          .map((claim) => participantsById[claim.participantId])
          .filter(Boolean) as Participant[];
        const isOpen = itemClaims.length === 0;
        const isShared = itemClaims.length > 1;
        const isClaimedByViewer =
          !!viewerParticipantId &&
          itemClaims.some((claim) => claim.participantId === viewerParticipantId);
        const canClaim = !!viewerParticipantId && !isClaimedByViewer;
        const metaText = isOpen ? "UNCLAIMED" : isShared ? `Shared by ${itemClaims.length} people` : "CLAIMED";

        return (
          <article
            className={isOpen ? "event-summary-item-card open" : "event-summary-item-card"}
            key={item.id}
          >
            {isOpen ? <div className="event-summary-open-ribbon">Open</div> : null}

            <div className="event-summary-item-main">
              <div
                className={
                  isOpen
                    ? "event-summary-item-icon tertiary"
                    : isShared
                      ? "event-summary-item-icon secondary"
                      : "event-summary-item-icon primary"
                }
              >
                <EventSummaryIcon icon={getItemIcon(item.name)} />
              </div>

              <div className="event-summary-item-body">
                <strong>{item.name}</strong>
                <span className={isOpen ? "event-summary-item-meta open" : "event-summary-item-meta"}>
                  {metaText}
                </span>
              </div>
            </div>

            {!isOpen && claimParticipants.length ? (
              <div className="event-summary-item-claimers">
                <div className="event-summary-item-avatar-stack">
                  {claimParticipants.slice(0, 3).map((participant, index) => (
                    <div
                      className={`event-summary-avatar tone-${getAvatarTone(index)}`}
                      key={participant.id}
                    >
                      {getInitials(participant.displayName)}
                    </div>
                  ))}
                  {claimParticipants.length > 3 ? (
                    <div className="event-summary-avatar tone-muted">
                      +{claimParticipants.length - 3}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="event-summary-item-footer">
              <strong className="event-summary-item-price">
                {formatCurrency(item.totalPrice, currency)}
              </strong>

              <div className="event-summary-item-actions">
                {canClaim ? (
                  <button
                    className="event-summary-item-claim"
                    disabled={pendingItemId === item.id}
                    onClick={() => handleClaim(item)}
                    type="button"
                  >
                    {pendingItemId === item.id ? "Updating..." : "Claim"}
                  </button>
                ) : isClaimedByViewer ? (
                  <button
                    className="event-summary-item-claim ghost"
                    disabled={pendingItemId === item.id}
                    onClick={() => handleUnclaim(item.id)}
                    type="button"
                  >
                    {pendingItemId === item.id ? "Updating..." : "Unclaim"}
                  </button>
                ) : (
                  <span className={isShared ? "event-summary-item-tag shared" : "event-summary-item-tag"}>
                    {isShared ? "Shared" : "Claimed"}
                  </span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
