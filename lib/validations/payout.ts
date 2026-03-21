import { z } from "zod";

export const upsertPayoutSchema = z.object({
  payoutType: z.enum(["bank_account", "promptpay_qr", "mixed"]),
  recipientName: z.string().trim().min(1, "Recipient name is required."),
  bankName: z.string().trim().optional().nullable(),
  accountNumber: z.string().trim().optional().nullable(),
  qrImagePath: z.string().trim().optional().nullable()
});
