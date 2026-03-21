import { NextResponse } from "next/server";
import { createEvent, listEvents } from "@/lib/repositories/events";
import {
  getParticipantSessionCookieName,
  getParticipantSessionCookieOptions
} from "@/lib/session/participant-session";
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

  const { event, hostParticipant } = createEvent(payload.data);
  const response = NextResponse.json({
    id: event.id,
    shareToken: event.shareToken,
    status: event.status
  });

  response.cookies.set(
    getParticipantSessionCookieName(event.shareToken),
    hostParticipant.id,
    getParticipantSessionCookieOptions()
  );

  return response;
}
