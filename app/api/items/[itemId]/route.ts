import { NextResponse } from "next/server";
import { deleteItemById, updateItemById } from "@/lib/repositories/items";
import { updateItemSchema } from "@/lib/validations/item";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await context.params;
  const payload = updateItemSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_ITEM_PATCH",
          message: payload.error.issues[0]?.message ?? "Invalid item update payload."
        }
      },
      { status: 400 }
    );
  }

  try {
    const item = updateItemById(itemId, payload.data);

    if (!item) {
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

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await context.params;

  try {
    const deleted = deleteItemById(itemId);

    if (!deleted) {
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
