import { z } from "zod";

export type ProductAddInput = z.infer<typeof productAddSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export const productAddSchema = z.object({
	name: z
		.string()
		.min(3, "Nome deve ter pelo menos 3 caracteres")
		.max(200, "Nome deve ter no máximo 200 caracteres"),
	description: z
		.string()
		.min(10, "Descrição deve ter pelo menos 10 caracteres")
		.max(500, "Descrição deve ter no máximo 500 caracteres"),
	price: z
		.number()
		.int("Preço deve ser um número inteiro")
		.min(0, "Preço deve ser maior ou igual a 0"),
	slug: z
		.string()
		.min(3, "Slug deve ter pelo menos 3 caracteres")
		.max(200, "Slug deve ter no máximo 200 caracteres"),
	images: z.array(z.url("URL da imagem deve ser uma URL válida")).optional(),
});

export const productUpdateSchema = productAddSchema.partial().extend({
	id: z.string().min(1, "ID é obrigatório"),
});
