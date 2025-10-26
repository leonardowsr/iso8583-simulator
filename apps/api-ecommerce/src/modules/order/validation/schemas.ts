import { z } from "zod";

export const productAddSchema = z.object({
	name: z
		.string()
		.min(3, "name must be at least 3 characters")
		.max(100, "name must be at most 100 characters"),
	description: z
		.string()
		.min(10, "description must be at least 10 characters")
		.max(500, "description must be at most 500 characters"),
	price: z
		.number()
		.int("price must be an integer")
		.min(0, "price must be greater than or equal to 0"),
	images: z.string().url("images must be a valid URL").optional(),
});

export const productUpdateSchema = z.object({
	id: z.string().min(1, "id is required"),
	name: z
		.string()
		.min(3, "name must be at least 3 characters")
		.max(100, "name must be at most 100 characters")
		.optional(),
	description: z
		.string()
		.min(10, "description must be at least 10 characters")
		.max(500, "description must be at most 500 characters")
		.optional(),
	price: z
		.number()
		.int("price must be an integer")
		.min(0, "price must be greater than or equal to 0")
		.optional(),
	images: z.string().url("images must be a valid URL").nullable().optional(),
});

export type ProductAddInput = z.infer<typeof productAddSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
