import type { Category } from "./category";

type Product = {
	title: string;
	slug: string;
	images: string[];
	price: number;
	description: string;
	category: Category;
};

export type { Product };
