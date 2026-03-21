import { NextResponse } from "next/server";
import { getSummaryByShareToken } from "@/lib/repositories/payments";

export async function GET(
  _request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;
  const summary = getSummaryByShareToken(shareToken);

  if (!summary) {
    return NextResponse.json(
      { error: { code: "EVENT_NOT_FOUND", message: "Event not found." } },
      { status: 404 }
    );
  }

  return NextResponse.json(summary);
}
