import { estimateSummary } from "@/lib/calculations/estimate-summary";
import { ensureFinalizable } from "@/lib/guards/ensure-finalizable";
import type { EventSummaryResponse } from "@/types/api";
import { getEventByShareToken } from "./events";
import { listClaimsByEventId } from "./claims";
import { listItemsByShareToken } from "./items";
import { mapPaymentStatusRow, mapParticipantRow } from "./mappers";
import { listParticipantsByShareToken } from "./participants";
import { supabaseRpc, supabaseRest } from "@/lib/supabase/rest";

export async function getSummaryByShareToken(shareToken: string): Promise<EventSummaryResponse | undefined> {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const [participants, items, claims, paymentRowsResult] = await Promise.all([
    listParticipantsByShareToken(shareToken),
    listItemsByShareToken(shareToken),
    listClaimsByEventId(event.id),
    supabaseRest<Record<string, unknown>[]>("payment_statuses", {
      query: {
        select: "*",
        event_id: `eq.${event.id}`
      }
    })
  ]);
  const paymentRows = paymentRowsResult ?? [];

  if ((event.status === "finalized" || event.status === "settled") && paymentRows.length > 0) {
    const payments = paymentRows.map(mapPaymentStatusRow);

    return {
      isFinal: true,
      eventSubtotal: items.reduce((sum, item) => sum + item.totalPrice, 0),
      participants: payments.map((payment) => {
        const participant = participants.find((entry) => entry.id === payment.participantId);

        return {
          participantId: payment.participantId,
          displayName: participant?.displayName ?? "Unknown",
          finalSubtotal: payment.finalSubtotal,
          finalServiceCharge: payment.finalServiceCharge,
          finalVat: payment.finalVat,
          finalTotal: payment.finalTotal,
          paymentStatus: payment.paymentStatus
        };
      })
    };
  }

  return estimateSummary({
    event,
    participants,
    items,
    claims
  });
}

export async function finalizeEventByShareToken(shareToken: string) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const items = await listItemsByShareToken(shareToken);
  ensureFinalizable(items);
  await supabaseRpc("finalize_event", { p_event_id: event.id });
  return getEventByShareToken(shareToken);
}

export async function listPaymentStatusesByShareToken(shareToken: string) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return [];
  }

  const [paymentRowsResult, participantRowsResult] = await Promise.all([
    supabaseRest<Record<string, unknown>[]>("payment_statuses", {
      query: {
        select: "*",
        event_id: `eq.${event.id}`
      }
    }),
    supabaseRest<Record<string, unknown>[]>("participants", {
      query: {
        select: "*",
        event_id: `eq.${event.id}`
      }
    })
  ]);
  const paymentRows = paymentRowsResult ?? [];
  const participantRows = participantRowsResult ?? [];

  const participants = participantRows.map(mapParticipantRow);
  const payments = paymentRows.map(mapPaymentStatusRow);

  return payments.map((payment) => {
    const participant = participants.find((entry) => entry.id === payment.participantId);

    return {
      participantId: payment.participantId,
      displayName: participant?.displayName ?? "Unknown",
      finalTotal: payment.finalTotal,
      paymentStatus: payment.paymentStatus
    };
  });
}

export async function markParticipantPaid(shareToken: string, participantId: string) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const rows =
    (await supabaseRest<Record<string, unknown>[]>("payment_statuses", {
    method: "PATCH",
    query: {
      event_id: `eq.${event.id}`,
      participant_id: `eq.${participantId}`
    },
    body: {
      payment_status: "marked_paid"
    }
    })) ?? [];

  return rows[0] ? mapPaymentStatusRow(rows[0]) : undefined;
}

export async function confirmParticipantPayment(shareToken: string, participantId: string) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const rows =
    (await supabaseRest<Record<string, unknown>[]>("payment_statuses", {
    method: "PATCH",
    query: {
      event_id: `eq.${event.id}`,
      participant_id: `eq.${participantId}`
    },
    body: {
      payment_status: "confirmed",
      paid_at: new Date().toISOString()
    }
    })) ?? [];

  return rows[0] ? mapPaymentStatusRow(rows[0]) : undefined;
}
