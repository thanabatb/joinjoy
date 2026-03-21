import { NextResponse } from "next/server";
import { listPaymentStatusesByShareToken } from "@/lib/repositories/payments";

export async function GET(
  _request: Request,
  context: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await context.params;
  return NextResponse.json(listPaymentStatusesByShareToken(shareToken));
}
