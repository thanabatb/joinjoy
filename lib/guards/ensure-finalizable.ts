import type { Item } from "@/types/item";

export function ensureFinalizable(items: Item[]) {
  const unresolvedItem = items.find((item) => item.status !== "claimed" && item.status !== "resolved");

  if (unresolvedItem) {
    throw new Error("Unresolved items remain. Finalization is blocked.");
  }
}
