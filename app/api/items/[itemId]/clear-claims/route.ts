import { NextResponse } from "next/server";
import { clearClaimsForItem } from "@/lib/repositories/claims";

export async function POST(
  _request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await context.params;

  try {
    const success = await clearClaimsForItem(itemId);

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
