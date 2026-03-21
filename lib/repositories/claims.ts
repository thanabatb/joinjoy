import { splitItemEvenly } from "@/lib/calculations/split-item";
import { ensureItemEditable } from "@/lib/guards/ensure-item-editable";
import { getStore } from "@/lib/repositories/mock-store";
import type { ClaimCreatorType, ItemClaim } from "@/types/claim";

function updateItemStatus(itemId: string) {
  const store = getStore();
  const item = store.items.find((entry) => entry.id === itemId);

  if (!item) {
    return;
  }

  const claimTotal = store.itemClaims
    .filter((claim) => claim.itemId === itemId)
    .reduce((sum, claim) => sum + claim.splitAmount, 0);

  if (claimTotal === 0) {
    item.status = "unclaimed";
  } else if (claimTotal < item.totalPrice) {
    item.status = "partial";
  } else {
    item.status = "claimed";
  }

  item.updatedAt = new Date().toISOString();
}

function replaceClaims(itemId: string, rows: Array<Pick<ItemClaim, "participantId" | "splitAmount" | "splitRatio">>, createdByType: ClaimCreatorType) {
  const store = getStore();
  const item = store.items.find((entry) => entry.id === itemId);

  if (!item) {
    return false;
  }

  const event = store.events.find((entry) => entry.id === item.eventId);

  if (!event) {
    return false;
  }

  ensureItemEditable(event);
  const now = new Date().toISOString();
  store.itemClaims = store.itemClaims.filter((claim) => claim.itemId !== itemId);
  store.itemClaims.push(
    ...rows.map((row) => ({
      id: crypto.randomUUID(),
      eventId: item.eventId,
      itemId,
      participantId: row.participantId,
      splitAmount: row.splitAmount,
      splitRatio: row.splitRatio,
      createdByType,
      createdAt: now,
      updatedAt: now
    }))
  );
  updateItemStatus(itemId);
  return true;
}

export function listClaimsByEventId(eventId: string) {
  return getStore().itemClaims.filter((claim) => claim.eventId === eventId);
}

export function claimItemForParticipant(itemId: string, participantId: string) {
  const store = getStore();
  const item = store.items.find((entry) => entry.id === itemId);

  if (!item) {
    return false;
  }

  return replaceClaims(
    itemId,
    [
      {
        participantId,
        splitAmount: item.totalPrice,
        splitRatio: 1
      }
    ],
    "participant"
  );
}

export function splitItemAcrossParticipants(itemId: string, participantIds: string[]) {
  const store = getStore();
  const item = store.items.find((entry) => entry.id === itemId);

  if (!item) {
    return false;
  }

  const splitRows = splitItemEvenly(item.totalPrice, participantIds);
  return replaceClaims(itemId, splitRows, "system");
}

export function clearClaimsForItem(itemId: string) {
  const store = getStore();
  const item = store.items.find((entry) => entry.id === itemId);

  if (!item) {
    return false;
  }

  const event = store.events.find((entry) => entry.id === item.eventId);

  if (!event) {
    return false;
  }

  ensureItemEditable(event);
  store.itemClaims = store.itemClaims.filter((claim) => claim.itemId !== itemId);
  updateItemStatus(itemId);
  return true;
}
