import { z } from "zod";

export type UpdateAccountBalanceInput = z.infer<
	typeof updateAccountBalanceSchema
>;
export type ValidateAccountInput = z.infer<typeof validateAccountSchema>;

export const updateAccountBalanceSchema = z.object({
	accountId: z.string().min(1, "accountId is required"),
	amount: z.number().int().min(0, "amount must be >= 0"),
});

export const validateAccountSchema = z.object({
	cardHolderName: z.string().min(1, "cardHolderName is required"),
	cardNumber: z.string().min(12, "cardNumber is too short"),
	amount: z.number().int().min(0, "amount must be >= 0"),
	expiryDate: z.string().min(1, "expiryDate is required"),
});
