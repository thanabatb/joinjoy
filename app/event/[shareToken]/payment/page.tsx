import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { MarkPaidButton } from "@/components/payment/mark-paid-button";
import { PaymentStatusList } from "@/components/payment/payment-status-list";
import { PayoutInfoCard } from "@/components/payment/payout-info-card";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { getSummaryByShareToken, listPaymentStatusesByShareToken } from "@/lib/repositories/payments";
import { getPayoutByShareToken } from "@/lib/repositories/payout";

export default async function PaymentPage({
  params
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  const event = await getEventOverviewByShareToken(shareToken);

  if (!event) {
    notFound();
  }

  const payout = await getPayoutByShareToken(shareToken);
  const summary = await getSummaryByShareToken(shareToken);
  const statuses = await listPaymentStatusesByShareToken(shareToken);
  const firstParticipant = statuses[0];
  const canMarkPaid = event.status === "finalized" && firstParticipant;

  return (
    <main className="page-shell stack">
      <PageHeader
        eyebrow="Screen 13 and 14"
        title="Settle the event"
        description="After the event is finalized, participants can see the host payout details and move themselves toward paid."
        actions={canMarkPaid ? <MarkPaidButton participantId={firstParticipant.participantId} shareToken={shareToken} /> : null}
      />
      <div className="grid-2">
        <PayoutInfoCard
          amount={summary?.isFinal ? summary.participants[0]?.finalTotal : undefined}
          currency={event.currency}
          payout={payout}
        />
        <PaymentStatusList currency={event.currency} rows={statuses} />
      </div>
    </main>
  );
}
