import { roundCurrency } from "@/lib/calculations/rounding";
import { estimateSummary } from "@/lib/calculations/estimate-summary";
import type { PaymentStatus } from "@/types/payment";
import type { ItemClaim } from "@/types/claim";
import type { Event } from "@/types/event";
import type { Item } from "@/types/item";
import type { Participant } from "@/types/participant";

export function buildFinalPaymentStatuses(args: {
  event: Event;
  participants: Participant[];
  items: Item[];
  claims: ItemClaim[];
}): PaymentStatus[] {
  const estimated = estimateSummary(args);
  const now = new Date().toISOString();

  return estimated.participants.map((participant) => ({
    id: crypto.randomUUID(),
    eventId: args.event.id,
    participantId: participant.participantId,
    finalSubtotal: roundCurrency(participant.subtotal ?? 0),
    finalServiceCharge: roundCurrency(participant.estimatedServiceCharge ?? 0),
    finalVat: roundCurrency(participant.estimatedVat ?? 0),
    finalTotal: roundCurrency(participant.estimatedTotal ?? 0),
    paymentStatus: "unpaid",
    paidAt: null,
    createdAt: now,
    updatedAt: now
  }));
}
