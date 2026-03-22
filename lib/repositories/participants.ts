import { ensureEventEditable } from "@/lib/guards/ensure-event-editable";
import type { Participant } from "@/types/participant";
import { getEventByShareToken } from "./events";
import { mapParticipantRow } from "./mappers";
import { supabaseRest } from "@/lib/supabase/rest";

export async function listParticipantsByShareToken(shareToken: string) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return [];
  }

  const rows =
    (await supabaseRest<Record<string, unknown>[]>("participants", {
    query: {
      select: "*",
      event_id: `eq.${event.id}`,
      order: "created_at.asc"
    }
    })) ?? [];

  return rows.map(mapParticipantRow);
}

export async function addParticipantToEvent(
  shareToken: string,
  input: Pick<Participant, "displayName" | "isHost">
) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  ensureEventEditable(event);
  const participants = await listParticipantsByShareToken(shareToken);
  const duplicate = participants.find(
    (participant) =>
      participant.displayName.toLowerCase() === input.displayName.trim().toLowerCase()
  );

  if (duplicate) {
    if (!duplicate.joinedAt) {
      const rows =
        (await supabaseRest<Record<string, unknown>[]>("participants", {
        method: "PATCH",
        query: {
          id: `eq.${duplicate.id}`
        },
        body: {
          joined_at: new Date().toISOString(),
          status: "joined"
        }
        })) ?? [];

      return rows[0] ? mapParticipantRow(rows[0]) : duplicate;
    }

    return duplicate;
  }

  const rows =
    (await supabaseRest<Record<string, unknown>[]>("participants", {
    method: "POST",
    body: {
      event_id: event.id,
      display_name: input.displayName.trim(),
      joined_at: new Date().toISOString(),
      is_host: input.isHost,
      status: "joined"
    }
    })) ?? [];

  return rows[0] ? mapParticipantRow(rows[0]) : undefined;
}
