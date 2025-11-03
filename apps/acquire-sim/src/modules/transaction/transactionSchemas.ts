import { z } from "zod";

export const transactionAddSchema = z.object({
	userId: z.string().min(1, "userId é obrigatório"),
	orderRef: z.string().min(1, "orderRef é obrigatório"),
	amount: z
		.number()
		.int("amount must be integer")
		.min(0, "amount must be >= 0")
		.refine((v) => String(v).length <= 12, {
			message: "Valor da transação excede o limite permitido",
		}),
	idempotencyKey: z.string().min(1, "idempotencyKey é obrigatório"),
	cardNumber: z
		.string()
		.min(12, "cardNumber é muito curto")
		.max(19, "cardNumber é muito longo"),
	cardHolderName: z.string().min(1, "cardHolderName é obrigatório"),
	cardExpiryMonth: z.string().length(2, "cardExpiryMonth must be 2 digits"),
	cardExpiryYear: z.string().length(2, "cardExpiryYear must be 2 digits"),
	cardCvv: z.string().length(3, "cardCvv must be 3 digits"),
});

export type TransactionAddInput = z.infer<typeof transactionAddSchema>;
