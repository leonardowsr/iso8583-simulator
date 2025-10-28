import mongoose, { type Document, type Model } from "mongoose";

const Schema = new mongoose.Schema<IProduct>(
	{
		name: {
			type: String,
			required: true,
			description: "Name of the product",
		},
		slug: {
			type: String,
			required: true,
			description: "Slug of the product",
			unique: true,
		},
		price: {
			type: Number,
			required: true,
			description: "Price of the product",
		},
		description: {
			type: String,
			required: true,
			description: "Description of the product",
		},
		images: {
			type: [String],
			required: false,
			description: "Image URL of the product",
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
			description: "Category of the product",
		},
	},
	{ collection: "Product", timestamps: true },
);

export type IProduct = {
	name: string;
	price: number;
	slug: string;
	description: string;
	images: string[];
	category: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
} & Document;
export const Product: Model<IProduct> = mongoose.model("Product", Schema);
