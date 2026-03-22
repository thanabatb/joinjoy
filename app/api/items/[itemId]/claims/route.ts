import { NextResponse } from "next/server";
import { claimItemForParticipant } from "@/lib/repositories/claims";
import { claimItemSchema } from "@/lib/validations/item";

export async function POST(
  request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await context.params;
  const payload = claimItemSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_CLAIM",
          message: payload.error.issues[0]?.message ?? "Invalid claim payload."
        }
      },
      { status: 400 }
    );
  }

  try {
    const success = await claimItemForParticipant(itemId, payload.data.participantId);

    if (!success) {
      return NextResponse.json(
        { error: { code: "ITEM_NOT_FOUND", message: "Item not found." } },
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
