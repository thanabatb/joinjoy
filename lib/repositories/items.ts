import { ensureEventEditable } from "@/lib/guards/ensure-event-editable";
import { getEventByShareToken } from "@/lib/repositories/events";
import type { Item } from "@/types/item";
import { getStore } from "./mock-store";

export function listItemsByShareToken(shareToken: string) {
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return [];
  }

  return getStore()
    .items.filter((item) => item.eventId === event.id)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function getItemById(itemId: string) {
  return getStore().items.find((item) => item.id === itemId);
}

export function addItemToEvent(
  shareToken: string,
  input: Pick<Item, "name" | "price" | "quantity" | "assignmentMode">
) {
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  ensureEventEditable(event);

  const store = getStore();
  const now = new Date().toISOString();
  const eventItems = store.items.filter((item) => item.eventId === event.id);
  const item: Item = {
    id: crypto.randomUUID(),
    eventId: event.id,
    name: input.name.trim(),
    price: input.price,
    quantity: input.quantity,
    totalPrice: input.price * input.quantity,
    assignmentMode: input.assignmentMode,
    status: input.assignmentMode === "unclaimed" ? "unclaimed" : "unclaimed",
    sortOrder: eventItems.length + 1,
    createdAt: now,
    updatedAt: now
  };

  store.items.push(item);
  if (event.status === "draft") {
    event.status = "claiming";
    event.updatedAt = now;
  }

  return item;
}

export function updateItemById(
  itemId: string,
  input: Partial<Pick<Item, "name" | "price" | "quantity" | "assignmentMode">>
) {
  const item = getItemById(itemId);

  if (!item) {
    return undefined;
  }

  const event = getStore().events.find((entry) => entry.id === item.eventId);

  if (!event) {
    return undefined;
  }

  ensureEventEditable(event);
  Object.assign(item, input);
  item.totalPrice = item.price * item.quantity;
  item.updatedAt = new Date().toISOString();

  return item;
}

export function deleteItemById(itemId: string) {
  const store = getStore();
  const item = getItemById(itemId);

  if (!item) {
    return false;
  }

  const event = store.events.find((entry) => entry.id === item.eventId);

  if (!event) {
    return false;
  }

  ensureEventEditable(event);
  store.items = store.items.filter((entry) => entry.id !== itemId);
  store.itemClaims = store.itemClaims.filter((claim) => claim.itemId !== itemId);
  return true;
}
