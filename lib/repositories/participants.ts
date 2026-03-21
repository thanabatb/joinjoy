import { getEventByShareToken } from "@/lib/repositories/events";
import { ensureEventEditable } from "@/lib/guards/ensure-event-editable";
import type { Participant } from "@/types/participant";
import { getStore } from "./mock-store";

export function listParticipantsByShareToken(shareToken: string) {
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return [];
  }

  return getStore().participants.filter((participant) => participant.eventId === event.id);
}

export function addParticipantToEvent(
  shareToken: string,
  input: Pick<Participant, "displayName" | "isHost">
) {
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  ensureEventEditable(event);

  const store = getStore();
  const duplicate = store.participants.find(
    (participant) =>
      participant.eventId === event.id &&
      participant.displayName.toLowerCase() === input.displayName.trim().toLowerCase()
  );

  if (duplicate) {
    if (!duplicate.joinedAt) {
      duplicate.joinedAt = new Date().toISOString();
      duplicate.status = "joined";
      duplicate.updatedAt = duplicate.joinedAt;
    }

    return duplicate;
  }

  const now = new Date().toISOString();
  const participant: Participant = {
    id: crypto.randomUUID(),
    eventId: event.id,
    displayName: input.displayName.trim(),
    joinedAt: now,
    isHost: input.isHost,
    status: "joined",
    browserFingerprint: null,
    createdAt: now,
    updatedAt: now
  };

  store.participants.push(participant);
  return participant;
}
