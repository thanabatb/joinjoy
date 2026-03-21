import { NextResponse } from "next/server";
import { createEvent, listEvents } from "@/lib/repositories/events";
import { createEventSchema } from "@/lib/validations/event";

export async function GET() {
  return NextResponse.json(listEvents());
}

export async function POST(request: Request) {
  const payload = createEventSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_EVENT",
          message: payload.error.issues[0]?.message ?? "Invalid event payload."
        }
      },
      { status: 400 }
    );
  }

  const event = createEvent(payload.data);

  return NextResponse.json({
    id: event.id,
    shareToken: event.shareToken,
    status: event.status
  });
}
