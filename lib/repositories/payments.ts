import { estimateSummary } from "@/lib/calculations/estimate-summary";
import { buildFinalPaymentStatuses } from "@/lib/calculations/finalize-summary";
import { ensureFinalizable } from "@/lib/guards/ensure-finalizable";
import { getEventByShareToken } from "@/lib/repositories/events";
import { listClaimsByEventId } from "@/lib/repositories/claims";
import { getStore } from "@/lib/repositories/mock-store";
import type { EventSummaryResponse } from "@/types/api";

export function getSummaryByShareToken(shareToken: string): EventSummaryResponse | undefined {
  const store = getStore();
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const participants = store.participants.filter((participant) => participant.eventId === event.id);
  const items = store.items.filter((item) => item.eventId === event.id);

  if (event.status === "finalized" || event.status === "settled") {
    return {
      isFinal: true,
      eventSubtotal: items.reduce((sum, item) => sum + item.totalPrice, 0),
      participants: store.paymentStatuses
        .filter((payment) => payment.eventId === event.id)
        .map((payment) => {
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
    claims: listClaimsByEventId(event.id)
  });
}

export function finalizeEventByShareToken(shareToken: string) {
  const store = getStore();
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const items = store.items.filter((item) => item.eventId === event.id);
  ensureFinalizable(items);
  const participants = store.participants.filter((participant) => participant.eventId === event.id);
  const paymentStatuses = buildFinalPaymentStatuses({
    event,
    participants,
    items,
    claims: listClaimsByEventId(event.id)
  });

  store.paymentStatuses = store.paymentStatuses.filter((payment) => payment.eventId !== event.id);
  store.paymentStatuses.push(...paymentStatuses);
  event.status = "finalized";
  event.finalizedAt = new Date().toISOString();
  event.updatedAt = event.finalizedAt;

  return event;
}

export function listPaymentStatusesByShareToken(shareToken: string) {
  const store = getStore();
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return [];
  }

  return store.paymentStatuses
    .filter((payment) => payment.eventId === event.id)
    .map((payment) => {
      const participant = store.participants.find((entry) => entry.id === payment.participantId);

      return {
        participantId: payment.participantId,
        displayName: participant?.displayName ?? "Unknown",
        finalTotal: payment.finalTotal,
        paymentStatus: payment.paymentStatus
      };
    });
}

export function markParticipantPaid(shareToken: string, participantId: string) {
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const payment = getStore().paymentStatuses.find(
    (entry) => entry.eventId === event.id && entry.participantId === participantId
  );

  if (!payment) {
    return undefined;
  }

  payment.paymentStatus = "marked_paid";
  payment.updatedAt = new Date().toISOString();
  return payment;
}

export function confirmParticipantPayment(shareToken: string, participantId: string) {
  const event = getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const payment = getStore().paymentStatuses.find(
    (entry) => entry.eventId === event.id && entry.participantId === participantId
  );

  if (!payment) {
    return undefined;
  }

  payment.paymentStatus = "confirmed";
  payment.paidAt = new Date().toISOString();
  payment.updatedAt = payment.paidAt;
  return payment;
}
