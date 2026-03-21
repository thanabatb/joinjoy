export type PaymentState = "unpaid" | "marked_paid" | "confirmed";

export interface PaymentStatus {
  id: string;
  eventId: string;
  participantId: string;
  finalSubtotal: number;
  finalServiceCharge: number;
  finalVat: number;
  finalTotal: number;
  paymentStatus: PaymentState;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}
