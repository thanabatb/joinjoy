import { NextResponse } from "next/server";
import { addItemToEvent, listItemsByShareToken } from "@/lib/repositories/items";
import { createItemSchema } from "@/lib/validations/item";

export async function GET(
  _request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;
  return NextResponse.json(listItemsByShareToken(shareToken));
}

export async function POST(
  request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;
  const payload = createItemSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_ITEM",
          message: payload.error.issues[0]?.message ?? "Invalid item payload."
        }
      },
      { status: 400 }
    );
  }

  try {
    const item = addItemToEvent(shareToken, payload.data);

    if (!item) {
      return NextResponse.json(
        { error: { code: "EVENT_NOT_FOUND", message: "Event not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
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
