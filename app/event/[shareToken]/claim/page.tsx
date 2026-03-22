import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { ItemList } from "@/components/items/item-list";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { listItemsByShareToken } from "@/lib/repositories/items";

export default async function ClaimPage({
  params
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  const event = await getEventOverviewByShareToken(shareToken);

  if (!event) {
    notFound();
  }

  const items = await listItemsByShareToken(shareToken);

  return (
    <main className="page-shell stack">
      <PageHeader
        backHref={`/event/${shareToken}/summary`}
        eyebrow="Screen 7"
        title="Claim what you had"
        description="This first pass renders the claim surfaces and item groups. The next implementation step is wiring interactive claim and split actions to the existing APIs."
        actions={
          <div className="button-row">
            <Link className="button-secondary" href={`/event/${shareToken}/summary`}>
              View my summary
            </Link>
          </div>
        }
      />
      <div className="notice">
        Estimated totals may change until every item is resolved and the host finalizes the event.
      </div>
      <div className="grid-3">
        <ItemList
          actionHint="Next step: Claim mine, Split with others, Not mine."
          currency={event.currency}
          items={items.filter((item) => item.status === "unclaimed")}
          title="Unclaimed items"
        />
        <ItemList
          actionHint="Shared items are split equally across selected people."
          currency={event.currency}
          items={items.filter((item) => item.assignmentMode === "shared_selected")}
          title="Shared items"
        />
        <ItemList
          actionHint="This section previews items already fully resolved."
          currency={event.currency}
          items={items.filter((item) => item.status === "claimed")}
          title="Claimed items"
        />
      </div>
    </main>
  );
}
