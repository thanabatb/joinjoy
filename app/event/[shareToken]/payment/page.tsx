import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { MarkPaidButton } from "@/components/payment/mark-paid-button";
import { PaymentStatusList } from "@/components/payment/payment-status-list";
import { PayoutInfoCard } from "@/components/payment/payout-info-card";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { getSummaryByShareToken, listPaymentStatusesByShareToken } from "@/lib/repositories/payments";
import { getPayoutByShareToken } from "@/lib/repositories/payout";
import { listParticipantsByShareToken } from "@/lib/repositories/participants";
import { getParticipantSessionCookieName } from "@/lib/session/participant-session";
import { normalizeShareToken } from "@/lib/utils/share-token";

export default async function PaymentPage({
  params
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken: rawShareToken } = await params;
  const shareToken = normalizeShareToken(rawShareToken);
  const event = await getEventOverviewByShareToken(shareToken);

  if (!event) {
    notFound();
  }

  const [payout, summary, statuses, participants, cookieStore] = await Promise.all([
    getPayoutByShareToken(shareToken),
    getSummaryByShareToken(shareToken),
    listPaymentStatusesByShareToken(shareToken),
    listParticipantsByShareToken(shareToken),
    cookies()
  ]);
  const participantId = cookieStore.get(getParticipantSessionCookieName(shareToken))?.value ?? null;
  const viewerParticipant =
    participants.find((participant) => participant.id === participantId && participant.joinedAt) ?? null;

  if (!viewerParticipant) {
    redirect(`/event/${shareToken}/join`);
  }

  const viewerSummary = summary?.participants.find(
    (participant) => participant.participantId === viewerParticipant.id
  );
  const viewerStatus = statuses.find((status) => status.participantId === viewerParticipant.id);
  const visibleStatuses = viewerParticipant.isHost ? statuses : viewerStatus ? [viewerStatus] : [];
  const amountDue = summary?.isFinal ? viewerSummary?.finalTotal : viewerSummary?.estimatedTotal;
  const canMarkPaid =
    event.status === "finalized" &&
    !!viewerStatus &&
    viewerStatus.paymentStatus === "unpaid";

  return (
    <main className="page-shell stack">
      <PageHeader
        backHref={
          viewerParticipant.isHost ? `/event/${shareToken}/host` : `/event/${shareToken}/my-summary`
        }
        eyebrow="Screen 13 and 14"
        title={viewerParticipant.isHost ? "Settle the event" : "Your payment"}
        description={
          viewerParticipant.isHost
            ? "After the event is finalized, participants can see the host payout details and move themselves toward paid."
            : "Review your amount, check the payout details, and mark your payment when you're done."
        }
        actions={
          canMarkPaid ? (
            <MarkPaidButton participantId={viewerParticipant.id} shareToken={shareToken} />
          ) : null
        }
      />
      <div className="grid-2">
        <PayoutInfoCard
          amount={amountDue}
          currency={event.currency}
          payout={payout}
        />
        <PaymentStatusList currency={event.currency} rows={visibleStatuses} />
      </div>
    </main>
  );
}
