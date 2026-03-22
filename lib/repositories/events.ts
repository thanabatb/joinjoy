import { ensureEventEditable } from "@/lib/guards/ensure-event-editable";
import type { Event, EventOverview } from "@/types/event";
import type { Participant } from "@/types/participant";
import { mapEventRow, mapItemRow, mapParticipantRow } from "./mappers";
import { supabaseRest } from "@/lib/supabase/rest";
import { generateShareToken } from "@/lib/utils/token";

function getTotalAmount(items: Array<{ totalPrice: number }>) {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

type EventRow = Record<string, unknown>;

async function insertEventRow(body: Record<string, unknown>) {
  try {
    const rows =
      (await supabaseRest<EventRow[]>("events", {
      method: "POST",
      body
      })) ?? [];

    return rows[0] ?? null;
  } catch (error) {
    if (error instanceof Error && error.message.includes("occurred_at")) {
      const { occurred_at: _ignored, ...fallbackBody } = body;
      const rows =
        (await supabaseRest<EventRow[]>("events", {
        method: "POST",
        body: fallbackBody
        })) ?? [];

      return rows[0] ?? null;
    }

    throw error;
  }
}

async function patchEventRows(shareToken: string, body: Record<string, unknown>) {
  try {
    return (
      (await supabaseRest<EventRow[]>("events", {
      method: "PATCH",
      query: {
        share_token: `eq.${shareToken}`
      },
      body
      })) ?? []
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("occurred_at")) {
      const { occurred_at: _ignored, ...fallbackBody } = body;
      return (
        (await supabaseRest<EventRow[]>("events", {
        method: "PATCH",
        query: {
          share_token: `eq.${shareToken}`
        },
        body: fallbackBody
        })) ?? []
      );
    }

    throw error;
  }
}

export async function listEvents() {
  const rows =
    (await supabaseRest<EventRow[]>("events", {
    query: {
      select: "*",
      order: "created_at.desc"
    }
    })) ?? [];

  return rows.map(mapEventRow);
}

export async function getEventById(eventId: string): Promise<Event | undefined> {
  const row = await supabaseRest<EventRow>("events", {
    query: {
      select: "*",
      id: `eq.${eventId}`
    },
    single: true,
    allowEmpty: true
  });

  return row ? mapEventRow(row) : undefined;
}

export async function getEventByShareToken(shareToken: string): Promise<Event | undefined> {
  const row = await supabaseRest<EventRow>("events", {
    query: {
      select: "*",
      share_token: `eq.${shareToken}`
    },
    single: true,
    allowEmpty: true
  });

  return row ? mapEventRow(row) : undefined;
}

export async function getEventOverviewByShareToken(shareToken: string): Promise<EventOverview | undefined> {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const [participantRowsResult, itemRowsResult] = await Promise.all([
    supabaseRest<Record<string, unknown>[]>("participants", {
      query: {
        select: "*",
        event_id: `eq.${event.id}`
      }
    }),
    supabaseRest<Record<string, unknown>[]>("items", {
      query: {
        select: "*",
        event_id: `eq.${event.id}`
      }
    })
  ]);
  const participantRows = participantRowsResult ?? [];
  const itemRows = itemRowsResult ?? [];

  const participants = participantRows.map(mapParticipantRow);
  const items = itemRows.map(mapItemRow);

  return {
    ...event,
    participantCount: participants.length,
    itemCount: items.length,
    joinedCount: participants.filter((participant) => participant.joinedAt).length,
    unresolvedCount: items.filter((item) => item.status !== "claimed" && item.status !== "resolved")
      .length,
    totalAmount: getTotalAmount(items)
  };
}

export async function createEvent(input: {
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
  const shareToken = generateShareToken();
  const eventRow = await insertEventRow({
    share_token: shareToken,
    title: input.title,
    venue_name: input.venueName?.trim() || null,
    occurred_at: input.occurredAt,
    currency: input.currency,
    service_charge_type: input.serviceChargeType,
    service_charge_rate: input.serviceChargeRate,
    vat_type: input.vatType,
    vat_rate: input.vatRate,
    status: "draft",
    host_name: input.hostName,
    calculation_note: "SC and VAT are distributed proportionally based on claimed subtotal."
  });

  if (!eventRow) {
    throw new Error("Unable to create event.");
  }

  const event = mapEventRow(eventRow);
  const participantRows =
    (await supabaseRest<Record<string, unknown>[]>("participants", {
    method: "POST",
    body: {
      event_id: event.id,
      display_name: input.hostName,
      joined_at: new Date().toISOString(),
      is_host: true,
      status: "joined"
    }
    })) ?? [];

  const hostParticipant = mapParticipantRow(participantRows[0]);

  return { event, hostParticipant };
}

export async function updateEventByShareToken(
  shareToken: string,
  input: Partial<Omit<Event, "id" | "shareToken" | "createdAt" | "updatedAt">>
) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  ensureEventEditable(event);

  const patch: Record<string, unknown> = {};

  if (input.title !== undefined) patch.title = input.title;
  if (input.venueName !== undefined) patch.venue_name = input.venueName;
  if (input.occurredAt !== undefined) patch.occurred_at = input.occurredAt;
  if (input.currency !== undefined) patch.currency = input.currency;
  if (input.serviceChargeType !== undefined) patch.service_charge_type = input.serviceChargeType;
  if (input.serviceChargeRate !== undefined) patch.service_charge_rate = input.serviceChargeRate;
  if (input.vatType !== undefined) patch.vat_type = input.vatType;
  if (input.vatRate !== undefined) patch.vat_rate = input.vatRate;
  if (input.status !== undefined) patch.status = input.status;
  if (input.hostName !== undefined) patch.host_name = input.hostName;
  if (input.calculationNote !== undefined) patch.calculation_note = input.calculationNote;
  if (input.finalizedAt !== undefined) patch.finalized_at = input.finalizedAt;

  const rows = (await patchEventRows(shareToken, patch)) ?? [];
  const row = rows[0];

  return row ? mapEventRow(row) : undefined;
}
