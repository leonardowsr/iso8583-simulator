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
	cardExpiryMonth: z.string().min(1, "cardExpiryMonth é obrigatório"),
	cardExpiryYear: z.string().min(1, "cardExpiryYear é obrigatório"),
	cardCvv: z
		.string()
		.min(3, "cardCvv é 3 dígitos")
		.max(3, "cardCvv é 3 dígitos"),
});

export type TransactionAddInput = z.infer<typeof transactionAddSchema>;

