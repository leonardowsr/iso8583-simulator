import { z } from "zod";

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type OrderAddInput = z.infer<typeof orderAddSchema>;

export const orderItemSchema = z.object({
	productId: z.string().min(1, "productID é obrigatório"),
	quantity: z.number().int().min(1, "quantity deve ser pelo menos 1"),
});

export const orderAddSchema = z.object({
	userId: z.string().min(1, "userID é obrigatório"),
	items: z.array(orderItemSchema).min(1, "É necessário pelo menos um item"),
});
