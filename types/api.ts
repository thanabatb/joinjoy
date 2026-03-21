import type { PaymentState } from "@/types/payment";

export interface ApiErrorShape {
  error: {
    code: string;
    message: string;
  };
}

export interface SummaryParticipant {
  participantId: string;
  displayName: string;
  subtotal?: number;
  estimatedServiceCharge?: number;
  estimatedVat?: number;
  estimatedTotal?: number;
  finalSubtotal?: number;
  finalServiceCharge?: number;
  finalVat?: number;
  finalTotal?: number;
  paymentStatus?: PaymentState;
}

export interface EventSummaryResponse {
  isFinal: boolean;
  eventSubtotal: number;
  participants: SummaryParticipant[];
}
