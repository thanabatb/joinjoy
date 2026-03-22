import { NextResponse } from "next/server";
import { getPayoutByShareToken, upsertPayoutForEvent } from "@/lib/repositories/payout";
import { upsertPayoutSchema } from "@/lib/validations/payout";

export async function GET(
  _request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;
  const payout = await getPayoutByShareToken(shareToken);

  if (!payout) {
    return NextResponse.json(
      { error: { code: "PAYOUT_NOT_FOUND", message: "Payout info not found." } },
      { status: 404 }
    );
  }

  return NextResponse.json(payout);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;
  const payload = upsertPayoutSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PAYOUT",
          message: payload.error.issues[0]?.message ?? "Invalid payout payload."
        }
      },
      { status: 400 }
    );
  }

  try {
    const payout = await upsertPayoutForEvent(shareToken, {
      payoutType: payload.data.payoutType,
      recipientName: payload.data.recipientName,
      bankName: payload.data.bankName ?? null,
      accountNumber: payload.data.accountNumber ?? null,
      qrImagePath: payload.data.qrImagePath ?? null
    });

    if (!payout) {
      return NextResponse.json(
        { error: { code: "EVENT_NOT_FOUND", message: "Event not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "ITEM_ALREADY_FINALIZED",
          message: error instanceof Error ? error.message : "This event has already been finalized."
        }
      },
      { status: 409 }
    );
  }
}
