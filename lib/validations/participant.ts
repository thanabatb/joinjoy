import { z } from "zod";

export const addParticipantSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required."),
  isHost: z.boolean().optional().default(false)
});
