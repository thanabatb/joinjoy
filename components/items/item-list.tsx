import { EmptyState } from "@/components/common/empty-state";
import { ItemCard } from "@/components/items/item-card";
import type { Item } from "@/types/item";

export function ItemList({
  title,
  items,
  currency,
  actionHint
}: {
  title: string;
  items: Item[];
  currency: string;
  actionHint?: string;
}) {
  return (
    <section className="card stack">
      <div className="toolbar">
        <h2 className="section-title">{title}</h2>
        <span className="eyebrow">{items.length} items</span>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No items yet" description="Add a few items to start the claiming flow." />
      ) : (
        <div className="stack">
          {items.map((item) => (
            <ItemCard actionHint={actionHint} currency={currency} item={item} key={item.id} />
          ))}
        </div>
      )}
    </section>
  );
}
