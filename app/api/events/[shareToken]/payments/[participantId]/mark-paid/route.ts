import { NextResponse } from "next/server";
import { markParticipantPaid } from "@/lib/repositories/payments";

export async function POST(
  _request: Request,
  context: { params: Promise<{ shareToken: string; participantId: string }> }
) {
  const { shareToken, participantId } = await context.params;
  const payment = await markParticipantPaid(shareToken, participantId);

  if (!payment) {
    return NextResponse.json(
      { error: { code: "PAYMENT_NOT_FOUND", message: "Payment status not found." } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, paymentStatus: payment.paymentStatus });
}
