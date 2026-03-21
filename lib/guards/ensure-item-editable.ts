import { ensureEventEditable } from "@/lib/guards/ensure-event-editable";
import type { Event } from "@/types/event";

export function ensureItemEditable(event: Event) {
  ensureEventEditable(event);
}
