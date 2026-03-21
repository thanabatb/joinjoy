export type ParticipantStatus = "invited" | "joined" | "claimed" | "paid";

export interface Participant {
  id: string;
  eventId: string;
  displayName: string;
  joinedAt: string | null;
  isHost: boolean;
  status: ParticipantStatus;
  browserFingerprint: string | null;
  createdAt: string;
  updatedAt: string;
}
