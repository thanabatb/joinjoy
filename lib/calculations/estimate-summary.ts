import { allocateProportionally, roundCurrency, sumAmounts } from "@/lib/calculations/rounding";
import type { EventSummaryResponse } from "@/types/api";
import type { ItemClaim } from "@/types/claim";
import type { Event } from "@/types/event";
import type { Item } from "@/types/item";
import type { Participant } from "@/types/participant";

function calculateChargeTotal(type: Event["serviceChargeType"], rate: number, subtotal: number) {
  if (type === "none") {
    return 0;
  }

  if (type === "custom_amount") {
    return roundCurrency(rate);
  }

  return roundCurrency((subtotal * rate) / 100);
}

export function estimateSummary(args: {
  event: Event;
  participants: Participant[];
  items: Item[];
  claims: ItemClaim[];
}): EventSummaryResponse {
  const { event, participants, items, claims } = args;
  const eventSubtotal = sumAmounts(items.map((item) => item.totalPrice));
  const subtotalByParticipant = Object.fromEntries(
    participants.map((participant) => [participant.id, 0])
  );

  for (const claim of claims) {
    subtotalByParticipant[claim.participantId] = roundCurrency(
      (subtotalByParticipant[claim.participantId] ?? 0) + claim.splitAmount
    );
  }

  const subtotalShares = participants.map((participant) => ({
    key: participant.id,
    amount: subtotalByParticipant[participant.id] ?? 0
  }));

  const serviceChargeTotal = calculateChargeTotal(
    event.serviceChargeType,
    event.serviceChargeRate,
    eventSubtotal
  );
  const vatTotal = calculateChargeTotal(event.vatType, event.vatRate, eventSubtotal);
  const serviceChargeByParticipant = allocateProportionally(serviceChargeTotal, subtotalShares);
  const vatByParticipant = allocateProportionally(vatTotal, subtotalShares);

  return {
    isFinal: false,
    eventSubtotal,
    participants: participants.map((participant) => {
      const subtotal = subtotalByParticipant[participant.id] ?? 0;
      const estimatedServiceCharge = serviceChargeByParticipant[participant.id] ?? 0;
      const estimatedVat = vatByParticipant[participant.id] ?? 0;

      return {
        participantId: participant.id,
        displayName: participant.displayName,
        subtotal,
        estimatedServiceCharge,
        estimatedVat,
        estimatedTotal: roundCurrency(subtotal + estimatedServiceCharge + estimatedVat)
      };
    })
  };
}
