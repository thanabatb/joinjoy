import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { HistoryBackButton } from "@/components/common/history-back-button";
import { JoinEventForm } from "@/components/event/join-event-form";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { listParticipantsByShareToken } from "@/lib/repositories/participants";
import { getParticipantSessionCookieName } from "@/lib/session/participant-session";

export default async function JoinEventPage({
  params
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  const event = await getEventOverviewByShareToken(shareToken);

  if (!event) {
    notFound();
  }

  const participants = await listParticipantsByShareToken(shareToken);
  const cookieStore = await cookies();
  const participantId = cookieStore.get(getParticipantSessionCookieName(shareToken))?.value;

  if (participantId && participants.some((participant) => participant.id === participantId)) {
    redirect(`/event/${shareToken}/summary`);
  }

  return (
    <main className="page-shell join-event-page">
      <div className="join-event-back-row">
        <HistoryBackButton ariaLabel="Go back" className="create-back" fallbackHref="/">
          <span>←</span>
        </HistoryBackButton>
      </div>
      <JoinEventForm eventTitle={event.title} shareToken={shareToken} />
    </main>
  );
}
