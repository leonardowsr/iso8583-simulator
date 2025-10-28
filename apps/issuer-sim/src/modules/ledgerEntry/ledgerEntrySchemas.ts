import { z } from "zod";

export type CreateLedgerEntryInput = z.infer<typeof createLedgerEntrySchema>;

export const createLedgerEntrySchema = z.object({
	amount: z.number().int().min(0, "amount must be >= 0"),
	costumerAccountId: z.string().min(1, "costumerAccountId is required"),
	internalAccountId: z.string().min(1, "internalAccountId is required"),
	idempotencyKey: z.string().min(1, "idempotencyKey is required"),
});

export const checkExistingEntrySchema = z
	.string()
	.min(1, "idempotencyKey is required");
