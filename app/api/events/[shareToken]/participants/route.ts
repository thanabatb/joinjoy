import { NextResponse } from "next/server";
import { addParticipantToEvent, listParticipantsByShareToken } from "@/lib/repositories/participants";
import {
  getParticipantSessionCookieName,
  getParticipantSessionCookieOptions
} from "@/lib/session/participant-session";
import { addParticipantSchema } from "@/lib/validations/participant";

export async function GET(
  _request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;
  return NextResponse.json(listParticipantsByShareToken(shareToken));
}

export async function POST(
  request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;
  const payload = addParticipantSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PARTICIPANT",
          message: payload.error.issues[0]?.message ?? "Invalid participant payload."
        }
      },
      { status: 400 }
    );
  }

  try {
    const participant = addParticipantToEvent(shareToken, payload.data);

    if (!participant) {
      return NextResponse.json(
        { error: { code: "EVENT_NOT_FOUND", message: "Event not found." } },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      id: participant.id,
      displayName: participant.displayName,
      status: participant.status
    });

    response.cookies.set(
      getParticipantSessionCookieName(shareToken),
      participant.id,
      getParticipantSessionCookieOptions()
    );

    return response;
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
