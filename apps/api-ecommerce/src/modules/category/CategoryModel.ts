import mongoose, { type Document, type Model } from "mongoose";

const Schema = new mongoose.Schema<ICategory>(
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
		image: {
			type: String,
			required: false,
			description: "Image URL of the category",
		},
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ collection: "Category", timestamps: true },
);

export type ICategory = {
	name: string;
	slug: string;
	image: string;
	products: mongoose.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
} & Document;
export const Category: Model<ICategory> = mongoose.model("Category", Schema);
