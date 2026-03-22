import { NextResponse } from "next/server";
import { getSummaryByShareToken } from "@/lib/repositories/payments";
import { normalizeShareToken } from "@/lib/utils/share-token";

export async function GET(
  _request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken: rawShareToken } = await context.params;
  const shareToken = normalizeShareToken(rawShareToken);
  const summary = await getSummaryByShareToken(shareToken);

  if (!summary) {
    return NextResponse.json(
      { error: { code: "EVENT_NOT_FOUND", message: "Event not found." } },
      { status: 404 }
    );
  }

  return NextResponse.json(summary);
}
