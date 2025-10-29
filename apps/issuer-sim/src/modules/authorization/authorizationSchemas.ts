import { z } from "zod";

export type IsoParsedInput = z.infer<typeof isoParsedSchema>;

export const isoParsedSchema = z.object({
	idempotencyKey: z.string(),
	amount: z
		.number()
		.int()
		.min(0, "amount must be >= 0")
		.max(100000000000, "amount must be lower than 100000000000"),
	cardHolderName: z.string().min(1, "cardHolderName is required"),
	cardNumber: z.string().length(16, "cardNumber must be 16 characters long"),
	cardExpirationDate: z.string().min(1, "cardExpirationDate is required"),
});
