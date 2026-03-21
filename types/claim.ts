export type ClaimCreatorType = "participant" | "host" | "system";

export interface ItemClaim {
  id: string;
  eventId: string;
  itemId: string;
  participantId: string;
  splitAmount: number;
  splitRatio: number | null;
  createdByType: ClaimCreatorType;
  createdAt: string;
  updatedAt: string;
}
