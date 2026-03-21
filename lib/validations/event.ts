import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().trim().min(1, "Event title is required."),
  venueName: z.string().trim().optional().default(""),
  occurredAt: z.string().trim().min(1).default(new Date().toISOString()),
  currency: z.literal("THB").default("THB"),
  serviceChargeType: z.enum(["none", "percentage", "custom_amount"]),
  serviceChargeRate: z.coerce.number().min(0),
  vatType: z.enum(["none", "percentage", "custom_amount"]),
  vatRate: z.coerce.number().min(0),
  hostName: z.string().trim().min(1, "Host name is required.")
});

export const updateEventSchema = createEventSchema.partial().extend({
  status: z
    .enum(["draft", "claiming", "needs_review", "finalized", "settled"])
    .optional()
});
