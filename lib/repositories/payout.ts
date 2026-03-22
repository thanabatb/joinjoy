import { ensureEventEditable } from "@/lib/guards/ensure-event-editable";
import type { PayoutMethod } from "@/types/event";
import { getEventByShareToken } from "./events";
import { mapPayoutRow } from "./mappers";
import { supabaseRest } from "@/lib/supabase/rest";

export async function getPayoutByShareToken(shareToken: string) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  const row = await supabaseRest<Record<string, unknown>>("payout_methods", {
    query: {
      select: "*",
      event_id: `eq.${event.id}`
    },
    single: true,
    allowEmpty: true
  });

  return row ? mapPayoutRow(row) : undefined;
}

export async function upsertPayoutForEvent(
  shareToken: string,
  input: Omit<PayoutMethod, "id" | "eventId" | "createdAt" | "updatedAt">
) {
  const event = await getEventByShareToken(shareToken);

  if (!event) {
    return undefined;
  }

  ensureEventEditable(event);
  const existing = await getPayoutByShareToken(shareToken);

  if (existing) {
    const rows =
      (await supabaseRest<Record<string, unknown>[]>("payout_methods", {
      method: "PATCH",
      query: {
        id: `eq.${existing.id}`
      },
      body: {
        payout_type: input.payoutType,
        recipient_name: input.recipientName,
        bank_name: input.bankName,
        account_number: input.accountNumber,
        qr_image_path: input.qrImagePath
      }
      })) ?? [];

    return rows[0] ? mapPayoutRow(rows[0]) : existing;
  }

  const rows =
    (await supabaseRest<Record<string, unknown>[]>("payout_methods", {
    method: "POST",
    body: {
      event_id: event.id,
      payout_type: input.payoutType,
      recipient_name: input.recipientName,
      bank_name: input.bankName,
      account_number: input.accountNumber,
      qr_image_path: input.qrImagePath
    }
    })) ?? [];

  return rows[0] ? mapPayoutRow(rows[0]) : undefined;
}
