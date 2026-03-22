import { NextResponse } from "next/server";
import { listPaymentStatusesByShareToken } from "@/lib/repositories/payments";
import { normalizeShareToken } from "@/lib/utils/share-token";

export async function GET(
  _request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken: rawShareToken } = await context.params;
  const shareToken = normalizeShareToken(rawShareToken);
  return NextResponse.json(await listPaymentStatusesByShareToken(shareToken));
}
