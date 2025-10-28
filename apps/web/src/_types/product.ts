import type { Category } from "./category";

type Product = {
	name: string;
	slug: string;
	images: string[] | readonly string[];
	price: number;
	description: string;
	category: Category;
};

export type { Product };
