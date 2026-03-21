export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function sumAmounts(values: number[]): number {
  return roundCurrency(values.reduce((total, value) => total + value, 0));
}

export function allocateProportionally<T extends { key: string; amount: number }>(
  total: number,
  shares: T[]
): Record<string, number> {
  if (total === 0 || shares.length === 0) {
    return Object.fromEntries(shares.map((share) => [share.key, 0]));
  }

  const basis = sumAmounts(shares.map((share) => share.amount));

  if (basis === 0) {
    return Object.fromEntries(shares.map((share) => [share.key, 0]));
  }

  const provisional = shares.map((share) => ({
    ...share,
    allocated: roundCurrency((total * share.amount) / basis)
  }));

  const allocatedTotal = sumAmounts(provisional.map((share) => share.allocated));
  const diff = roundCurrency(total - allocatedTotal);

  if (diff !== 0) {
    const remainderTarget = [...provisional].sort((left, right) => {
      if (right.amount !== left.amount) {
        return right.amount - left.amount;
      }

      return left.key.localeCompare(right.key);
    })[0];

    remainderTarget.allocated = roundCurrency(remainderTarget.allocated + diff);
  }

  return Object.fromEntries(
    provisional.map((share) => [share.key, roundCurrency(share.allocated)])
  );
}
