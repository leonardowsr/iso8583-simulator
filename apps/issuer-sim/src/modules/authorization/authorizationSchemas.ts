import { z } from "zod";

export type IsoParsedInput = z.infer<typeof isoParsedSchema>;

export const isoParsedSchema = z.object({
	idempotencyKey: z.string().min(1, "idempotencyKey é obrigatório"),
	amount: z
		.number()
		.int()
		.min(0, "amount must be >= 0")
		.max(100000000000, "amount excede o limite permitido"),
	cardHolderName: z.string().min(1, "cardHolderName é obrigatório"),
	cardNumber: z
		.string()
		.min(12, "cardNumber é muito curto")
		.max(12, "cardNumber é muito longo"),
	cardExpirationDate: z.string().min(1, "cardExpirationDate é obrigatório"),
});
