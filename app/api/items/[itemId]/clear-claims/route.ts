import { NextResponse } from "next/server";
import { clearClaimsForItem, removeParticipantClaim } from "@/lib/repositories/claims";
import { clearClaimsSchema } from "@/lib/validations/item";

export async function POST(
  request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await context.params;
  const payload = clearClaimsSchema.safeParse(
    request.headers.get("content-length") === "0" ? {} : await request.json().catch(() => ({}))
  );

  if (!payload.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_CLEAR_CLAIM",
          message: payload.error.issues[0]?.message ?? "Invalid clear claim payload."
        }
      },
      { status: 400 }
    );
  }

  try {
    const success = payload.data.participantId
      ? await removeParticipantClaim(itemId, payload.data.participantId)
      : await clearClaimsForItem(itemId);

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
