import { NextResponse } from "next/server";
import { finalizeEventByShareToken } from "@/lib/repositories/payments";

export async function POST(
  _request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;

  try {
    const event = await finalizeEventByShareToken(shareToken);

    if (!event) {
      return NextResponse.json(
        { error: { code: "EVENT_NOT_FOUND", message: "Event not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, status: event.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "FINALIZE_BLOCKED",
          message: error instanceof Error ? error.message : "Unable to finalize event."
        }
      },
      { status: 409 }
    );
  }
}
