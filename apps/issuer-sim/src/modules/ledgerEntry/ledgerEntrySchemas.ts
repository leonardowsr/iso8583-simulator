import { z } from "zod";

export const checkExistingEntrySchema = z
	.string()
	.min(1, "idempotencyKey is required");
