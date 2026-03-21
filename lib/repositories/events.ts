import { ensureEventEditable } from "@/lib/guards/ensure-event-editable";
import { generateShareToken } from "@/lib/utils/token";
import type { Event, EventOverview } from "@/types/event";
import { getStore } from "./mock-store";

function getTotalAmount(eventId: string) {
  const store = getStore();
  return store.items
    .filter((item) => item.eventId === eventId)
    .reduce((sum, item) => sum + item.totalPrice, 0);
}

export function listEvents() {
  return getStore().events;
}

export function getEventByShareToken(shareToken: string): Event | undefined {
  return getStore().events.find((event) => event.shareToken === shareToken);
}

export function getEventOverviewByShareToken(shareToken: string): EventOverview | undefined {
  const store = getStore();
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const participants = store.participants.filter((participant) => participant.eventId === event.id);
  const items = store.items.filter((item) => item.eventId === event.id);

  return {
    ...event,
    participantCount: participants.length,
    itemCount: items.length,
    joinedCount: participants.filter((participant) => participant.joinedAt).length,
    unresolvedCount: items.filter((item) => item.status !== "claimed" && item.status !== "resolved").length,
    totalAmount: getTotalAmount(event.id)
  };
}

export function createEvent(input: {
  title: string;
  venueName?: string;
  occurredAt: string;
  currency: string;
  serviceChargeType: Event["serviceChargeType"];
  serviceChargeRate: number;
  vatType: Event["vatType"];
  vatRate: number;
  hostName: string;
}) {
  const store = getStore();
  const now = new Date().toISOString();
  const event: Event = {
    id: crypto.randomUUID(),
    shareToken: generateShareToken(),
    title: input.title,
    venueName: input.venueName?.trim() || null,
    occurredAt: input.occurredAt,
    currency: input.currency,
    serviceChargeType: input.serviceChargeType,
    serviceChargeRate: input.serviceChargeRate,
    vatType: input.vatType,
    vatRate: input.vatRate,
    status: "draft",
    hostName: input.hostName,
    calculationNote: "SC and VAT are distributed proportionally based on claimed subtotal.",
    finalizedAt: null,
    createdAt: now,
    updatedAt: now
  };

  store.events.push(event);
  store.participants.push({
    id: crypto.randomUUID(),
    eventId: event.id,
    displayName: input.hostName,
    joinedAt: now,
    isHost: true,
    status: "joined",
    browserFingerprint: null,
    createdAt: now,
    updatedAt: now
  });

  return event;
}

export function updateEventByShareToken(
  shareToken: string,
  input: Partial<Omit<Event, "id" | "shareToken" | "createdAt" | "updatedAt">>
) {
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  ensureEventEditable(event);
  Object.assign(event, input, { updatedAt: new Date().toISOString() });

  return event;
}
