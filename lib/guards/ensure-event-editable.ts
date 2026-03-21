import type { Event } from "@/types/event";

export function ensureEventEditable(event: Event) {
  if (event.status === "finalized" || event.status === "settled") {
    throw new Error("This event has already been finalized.");
  }
}
