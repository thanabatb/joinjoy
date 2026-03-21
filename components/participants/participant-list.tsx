import { StatusBadge } from "@/components/common/status-badge";
import type { Participant } from "@/types/participant";

export function ParticipantList({ participants }: { participants: Participant[] }) {
  return (
    <section className="card stack">
      <div className="toolbar">
        <h2 className="section-title">Members</h2>
        <span className="eyebrow">Screen 3</span>
      </div>
      <div className="stack">
        {participants.map((participant) => (
          <div className="detail-row" key={participant.id}>
            <div className="stack" style={{ gap: 4 }}>
              <strong>
                {participant.displayName}
                {participant.isHost ? " · Host" : ""}
              </strong>
              <span className="muted">
                {participant.joinedAt ? "Joined the event" : "Invited, not joined yet"}
              </span>
            </div>
            <StatusBadge status={participant.status} />
          </div>
        ))}
      </div>
    </section>
  );
}
