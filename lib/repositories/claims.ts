import { splitItemEvenly } from "@/lib/calculations/split-item";
import { ensureItemEditable } from "@/lib/guards/ensure-item-editable";
import type { ClaimCreatorType, ItemClaim } from "@/types/claim";
import { getEventById } from "./events";
import { getItemById } from "./items";
import { mapClaimRow } from "./mappers";
import { supabaseRpc, supabaseRest } from "@/lib/supabase/rest";

async function refreshItemStatus(itemId: string) {
  await supabaseRpc("refresh_item_status", { p_item_id: itemId }).catch(() => null);
}

async function listClaimsByItemId(itemId: string) {
  const rows =
    (await supabaseRest<Record<string, unknown>[]>("item_claims", {
      query: {
        select: "*",
        item_id: `eq.${itemId}`,
        order: "created_at.asc"
      }
    })) ?? [];

  return rows.map(mapClaimRow);
}

async function replaceClaims(
  itemId: string,
  rows: Array<Pick<ItemClaim, "participantId" | "splitAmount" | "splitRatio">>,
  createdByType: ClaimCreatorType
) {
  const item = await getItemById(itemId);

  if (!item) {
    return false;
  }

  const event = await getEventById(item.eventId);

  if (!event) {
    return false;
  }

  ensureItemEditable(event);

  await supabaseRest<Record<string, unknown>[]>("item_claims", {
    method: "DELETE",
    query: {
      item_id: `eq.${itemId}`
    }
  });

  if (rows.length > 0) {
    await supabaseRest<Record<string, unknown>[]>("item_claims", {
      method: "POST",
      body: rows.map((row) => ({
        event_id: item.eventId,
        item_id: itemId,
        participant_id: row.participantId,
        split_amount: row.splitAmount,
        split_ratio: row.splitRatio,
        created_by_type: createdByType
      }))
    });
  }

  await refreshItemStatus(itemId);
  return true;
}

export async function listClaimsByEventId(eventId: string) {
  const rows =
    (await supabaseRest<Record<string, unknown>[]>("item_claims", {
    query: {
      select: "*",
      event_id: `eq.${eventId}`,
      order: "created_at.asc"
    }
    })) ?? [];

  return rows.map(mapClaimRow);
}

export async function claimItemForParticipant(itemId: string, participantId: string) {
  const item = await getItemById(itemId);

  if (!item) {
    return false;
  }

  const claims = await listClaimsByItemId(itemId);
  const participantIds = Array.from(
    new Set([
      ...claims.map((claim) => claim.participantId),
      participantId
    ])
  );

  return replaceClaims(itemId, splitItemEvenly(item.totalPrice, participantIds), "participant");
}

export async function splitItemAcrossParticipants(itemId: string, participantIds: string[]) {
  const item = await getItemById(itemId);

  if (!item) {
    return false;
  }

  const splitRows = splitItemEvenly(item.totalPrice, participantIds);
  return replaceClaims(itemId, splitRows, "system");
}

export async function clearClaimsForItem(itemId: string) {
  const item = await getItemById(itemId);

  if (!item) {
    return false;
  }

  const event = await getEventById(item.eventId);

  if (!event) {
    return false;
  }

  ensureItemEditable(event);
  await supabaseRest<Record<string, unknown>[]>("item_claims", {
    method: "DELETE",
    query: {
      item_id: `eq.${itemId}`
    }
  });
  await refreshItemStatus(itemId);
  return true;
}

export async function removeParticipantClaim(itemId: string, participantId: string) {
  const item = await getItemById(itemId);

  if (!item) {
    return false;
  }

  const event = await getEventById(item.eventId);

  if (!event) {
    return false;
  }

  ensureItemEditable(event);

  const claims = await listClaimsByItemId(itemId);
  const remainingParticipantIds = claims
    .map((claim) => claim.participantId)
    .filter((currentParticipantId) => currentParticipantId !== participantId);

  if (remainingParticipantIds.length === claims.length) {
    return true;
  }

  if (remainingParticipantIds.length === 0) {
    return clearClaimsForItem(itemId);
  }

  return replaceClaims(
    itemId,
    splitItemEvenly(item.totalPrice, remainingParticipantIds),
    "participant"
  );
}
