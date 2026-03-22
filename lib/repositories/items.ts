import { ensureEventEditable } from "@/lib/guards/ensure-event-editable";
import type { Item } from "@/types/item";
import { getEventById, getEventByShareToken, updateEventByShareToken } from "./events";
import { mapItemRow } from "./mappers";
import { supabaseRpc, supabaseRest } from "@/lib/supabase/rest";

export async function listItemsByShareToken(shareToken: string) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return [];
  }

  const rows =
    (await supabaseRest<Record<string, unknown>[]>("items", {
    query: {
      select: "*",
      event_id: `eq.${event.id}`,
      order: "sort_order.asc"
    }
    })) ?? [];

  return rows.map(mapItemRow);
}

export async function getItemById(itemId: string) {
  const row = await supabaseRest<Record<string, unknown>>("items", {
    query: {
      select: "*",
      id: `eq.${itemId}`
    },
    single: true,
    allowEmpty: true
  });

  return row ? mapItemRow(row) : undefined;
}

export async function addItemToEvent(
  shareToken: string,
  input: Pick<Item, "name" | "price" | "quantity" | "assignmentMode">
) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  ensureEventEditable(event);
  const eventItems = await listItemsByShareToken(shareToken);
  const rows =
    (await supabaseRest<Record<string, unknown>[]>("items", {
    method: "POST",
    body: {
      event_id: event.id,
      name: input.name.trim(),
      price: input.price,
      quantity: input.quantity,
      assignment_mode: input.assignmentMode,
      status: "unclaimed",
      sort_order: eventItems.length + 1
    }
    })) ?? [];

  if (event.status === "draft") {
    await updateEventByShareToken(shareToken, { status: "claiming" });
  }

  return rows[0] ? mapItemRow(rows[0]) : undefined;
}

export async function updateItemById(
  itemId: string,
  input: Partial<Pick<Item, "name" | "price" | "quantity" | "assignmentMode">>
) {
  const item = await getItemById(itemId);

  if (!item) {
    return undefined;
  }

  const event = await getEventById(item.eventId);

  if (!event) {
    return undefined;
  }

  ensureEventEditable(event);
  const patch: Record<string, unknown> = {};

  if (input.name !== undefined) patch.name = input.name;
  if (input.price !== undefined) patch.price = input.price;
  if (input.quantity !== undefined) patch.quantity = input.quantity;
  if (input.assignmentMode !== undefined) patch.assignment_mode = input.assignmentMode;

  const rows =
    (await supabaseRest<Record<string, unknown>[]>("items", {
    method: "PATCH",
    query: {
      id: `eq.${itemId}`
    },
    body: patch
    })) ?? [];

  await supabaseRpc("refresh_item_status", { p_item_id: itemId }).catch(() => null);

  return rows[0] ? mapItemRow(rows[0]) : undefined;
}

export async function deleteItemById(itemId: string) {
  const item = await getItemById(itemId);

  if (!item) {
    return false;
  }

  const event = await getEventById(item.eventId);

  if (!event) {
    return false;
  }

  ensureEventEditable(event);
  await supabaseRest<Record<string, unknown>[]>("items", {
    method: "DELETE",
    query: {
      id: `eq.${itemId}`
    }
  });

  return true;
}
