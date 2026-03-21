import { ensureEventEditable } from "@/lib/guards/ensure-event-editable";
import { getEventByShareToken } from "@/lib/repositories/events";
import type { PayoutMethod } from "@/types/event";
import { getStore } from "./mock-store";

export function getPayoutByShareToken(shareToken: string) {
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  return getStore().payoutMethods.find((payout) => payout.eventId === event.id);
}

export function upsertPayoutForEvent(
  shareToken: string,
  input: Omit<PayoutMethod, "id" | "eventId" | "createdAt" | "updatedAt">
) {
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  ensureEventEditable(event);

  const store = getStore();
  const now = new Date().toISOString();
  const existing = store.payoutMethods.find((payout) => payout.eventId === event.id);

  if (existing) {
    Object.assign(existing, input, { updatedAt: now });
    return existing;
  }

  const payout: PayoutMethod = {
    id: crypto.randomUUID(),
    eventId: event.id,
    createdAt: now,
    updatedAt: now,
    ...input
  };

  store.payoutMethods.push(payout);
  return payout;
}
