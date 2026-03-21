import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { SummaryList } from "@/components/summary/summary-list";
import { TotalsBreakdown } from "@/components/summary/totals-breakdown";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { getSummaryByShareToken } from "@/lib/repositories/payments";

export default async function SummaryPage({
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

  const firstParticipant = summary.participants[0];
  const subtotal = summary.isFinal ? firstParticipant.finalSubtotal ?? 0 : firstParticipant.subtotal ?? 0;
  const serviceCharge = summary.isFinal
    ? firstParticipant.finalServiceCharge ?? 0
    : firstParticipant.estimatedServiceCharge ?? 0;
  const vat = summary.isFinal ? firstParticipant.finalVat ?? 0 : firstParticipant.estimatedVat ?? 0;
  const total = summary.isFinal ? firstParticipant.finalTotal ?? 0 : firstParticipant.estimatedTotal ?? 0;

  return (
    <main className="page-shell stack">
      <PageHeader
        eyebrow="Screen 9"
        title="My summary"
        description="Before finalization these numbers are estimates. After finalization the snapshot is locked and payment tracking can begin."
        actions={
          <div className="button-row">
            <Link className="button-ghost" href={`/event/${shareToken}/payment`}>
              Go to payment
            </Link>
          </div>
        }
      />
      <div className="grid-2">
        <TotalsBreakdown
          currency={event.currency}
          label={summary.isFinal ? `${firstParticipant.displayName}'s final total` : `${firstParticipant.displayName}'s estimate`}
          serviceCharge={serviceCharge}
          subtotal={subtotal}
          total={total}
          vat={vat}
        />
        <SummaryList currency={event.currency} summary={summary} />
      </div>
    </main>
  );
}
