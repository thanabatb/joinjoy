import { NextResponse } from "next/server";
import { splitItemAcrossParticipants } from "@/lib/repositories/claims";
import { splitItemSchema } from "@/lib/validations/item";

export async function POST(
  request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await context.params;
  const payload = splitItemSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_SPLIT",
          message: payload.error.issues[0]?.message ?? "Invalid split payload."
        }
      },
      { status: 400 }
    );
  }

  try {
    const success = await splitItemAcrossParticipants(itemId, payload.data.participantIds);

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
