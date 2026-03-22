import { NextResponse } from "next/server";
import { getEventOverviewByShareToken, updateEventByShareToken } from "@/lib/repositories/events";
import { updateEventSchema } from "@/lib/validations/event";

export async function GET(
  _request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;
  const event = await getEventOverviewByShareToken(shareToken);

  if (!event) {
    return NextResponse.json(
      { error: { code: "EVENT_NOT_FOUND", message: "Event not found." } },
      { status: 404 }
    );
  }

  return NextResponse.json(event);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;
  const payload = updateEventSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_EVENT_PATCH",
          message: payload.error.issues[0]?.message ?? "Invalid event update payload."
        }
      },
      { status: 400 }
    );
  }

  try {
    const event = await updateEventByShareToken(shareToken, payload.data);

    if (!event) {
      return NextResponse.json(
        { error: { code: "EVENT_NOT_FOUND", message: "Event not found." } },
        { status: 404 }
      );
    }
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

  return NextResponse.json({ success: true });
}
