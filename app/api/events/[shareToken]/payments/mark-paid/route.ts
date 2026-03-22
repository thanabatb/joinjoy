import { NextResponse } from "next/server";
import { markParticipantPaid } from "@/lib/repositories/payments";
import { normalizeShareToken } from "@/lib/utils/share-token";

export async function POST(
  request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken: rawShareToken } = await context.params;
  const shareToken = normalizeShareToken(rawShareToken);
  const body = (await request.json().catch(() => null)) as { participantId?: string } | null;

  if (!body?.participantId) {
    return NextResponse.json(
      { error: { code: "PARTICIPANT_REQUIRED", message: "Participant ID is required." } },
      { status: 400 }
    );
  }

  const payment = await markParticipantPaid(shareToken, body.participantId);

  if (!payment) {
    return NextResponse.json(
      { error: { code: "PAYMENT_NOT_FOUND", message: "Payment status not found." } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, paymentStatus: payment.paymentStatus });
}
