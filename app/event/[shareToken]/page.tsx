import { notFound } from "next/navigation";
import Link from "next/link";
import { EventHero } from "@/components/event/event-hero";
import { EventProgress } from "@/components/event/event-progress";
import { ShareLinkCard } from "@/components/event/share-link-card";
import { AddItemForm } from "@/components/items/add-item-form";
import { ItemList } from "@/components/items/item-list";
import { AddParticipantForm } from "@/components/participants/add-participant-form";
import { ParticipantList } from "@/components/participants/participant-list";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { listItemsByShareToken } from "@/lib/repositories/items";
import { listParticipantsByShareToken } from "@/lib/repositories/participants";

export default async function EventOverviewPage({
  params
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  const event = getEventOverviewByShareToken(shareToken);

  if (!event) {
    notFound();
  }

  const participants = listParticipantsByShareToken(shareToken);
  const items = listItemsByShareToken(shareToken);

  return (
    <main className="page-shell stack">
      <EventHero event={event} />
      <div className="grid-2">
        <EventProgress event={event} />
        <ShareLinkCard shareToken={shareToken} />
      </div>
      <div className="button-row">
        <Link className="button-secondary" href={`/event/${shareToken}/items`}>
          Go to add expenses
        </Link>
      </div>
      <div className="grid-2">
        <AddParticipantForm shareToken={shareToken} />
        <AddItemForm shareToken={shareToken} />
      </div>
      <div className="grid-2">
        <ParticipantList participants={participants} />
        <ItemList
          actionHint="Host can add fast now. Claim actions land on the claim screen."
          currency={event.currency}
          items={items}
          title="Current bill items"
        />
      </div>
    </main>
  );
}
