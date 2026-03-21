export type ChargeType = "none" | "percentage" | "custom_amount";
export type EventStatus =
  | "draft"
  | "claiming"
  | "needs_review"
  | "finalized"
  | "settled";

export interface Event {
  id: string;
  shareToken: string;
  title: string;
  venueName: string | null;
  occurredAt: string;
  currency: string;
  serviceChargeType: ChargeType;
  serviceChargeRate: number;
  vatType: ChargeType;
  vatRate: number;
  status: EventStatus;
  hostName: string;
  calculationNote: string | null;
  finalizedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventOverview extends Event {
  participantCount: number;
  itemCount: number;
  joinedCount: number;
  unresolvedCount: number;
  totalAmount: number;
}

export type PayoutType = "bank_account" | "promptpay_qr" | "mixed";

export interface PayoutMethod {
  id: string;
  eventId: string;
  payoutType: PayoutType;
  recipientName: string;
  bankName: string | null;
  accountNumber: string | null;
  qrImagePath: string | null;
  createdAt: string;
  updatedAt: string;
}
