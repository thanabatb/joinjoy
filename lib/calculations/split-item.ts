import { roundCurrency } from "@/lib/calculations/rounding";

export function splitItemEvenly(total: number, participantIds: string[]) {
  if (participantIds.length === 0) {
    return [];
  }

  const baseShare = roundCurrency(total / participantIds.length);
  const amounts = participantIds.map((participantId) => ({
    participantId,
    splitAmount: baseShare
  }));

  const assignedTotal = roundCurrency(
    amounts.reduce((sum, item) => sum + item.splitAmount, 0)
  );
  const diff = roundCurrency(total - assignedTotal);

  if (diff !== 0) {
    amounts[amounts.length - 1].splitAmount = roundCurrency(
      amounts[amounts.length - 1].splitAmount + diff
    );
  }

  return amounts.map((entry) => ({
    ...entry,
    splitRatio: roundCurrency(entry.splitAmount / total)
  }));
}
