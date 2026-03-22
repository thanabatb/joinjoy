import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().trim().min(1, "Item name is required."),
  price: z.coerce.number().min(0, "Price must be zero or greater."),
  quantity: z.coerce.number().int().positive("Quantity must be greater than zero."),
  assignmentMode: z.enum(["unclaimed", "host_assigned", "claim_later", "shared_selected"])
});

export const updateItemSchema = createItemSchema.partial();

export const claimItemSchema = z.object({
  participantId: z.string().trim().min(1, "Participant id is required.")
});

export const splitItemSchema = z.object({
  participantIds: z.array(z.string().trim().min(1)).min(1, "At least one participant is required.")
});

export const clearClaimsSchema = z.object({
  participantId: z.string().trim().min(1).optional()
});
