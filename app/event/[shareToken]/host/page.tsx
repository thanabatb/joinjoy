import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { EventProgress } from "@/components/event/event-progress";
import { FinalizeEventButton } from "@/components/event/finalize-event-button";
import { ItemList } from "@/components/items/item-list";
import { SummaryList } from "@/components/summary/summary-list";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { listItemsByShareToken } from "@/lib/repositories/items";
import { getSummaryByShareToken } from "@/lib/repositories/payments";

export default async function HostPage({
  params
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  const event = getEventOverviewByShareToken(shareToken);
  const summary = getSummaryByShareToken(shareToken);

  if (!event || !summary) {
    notFound();
  }

  const unresolvedItems = listItemsByShareToken(shareToken).filter(
    (item) => item.status !== "claimed" && item.status !== "resolved"
  );

  return (
    <main className="page-shell stack">
      <PageHeader
        eyebrow="Screen 10"
        title="Host dashboard"
        description="Monitor completion, resolve edge cases, and finalize only when every item is handled."
        actions={<FinalizeEventButton shareToken={shareToken} />}
      />
      <div className="grid-2">
        <EventProgress event={event} />
        <SummaryList currency={event.currency} summary={summary} />
      </div>
      <ItemList
        actionHint="Next step: assign, split selected members, split active members, or delete."
        currency={event.currency}
        items={unresolvedItems}
        title="Unresolved items"
      />
    </main>
  );
}
