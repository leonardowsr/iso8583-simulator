import mongoose from "mongoose";

export const Schema = new mongoose.Schema<IOrderItem>(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
			description: "Reference to the product",
		},
		productName: {
			type: String,
			required: true,
			description: "Product name at the time of purchase",
		},
		productDescription: {
			type: String,
			required: true,
			description: "Product description at the time of purchase",
		},
		productImageUrl: {
			type: String,
			required: false,
			description: "Product image URL at the time of purchase",
		},
		quantity: {
			type: Number,
			required: true,
			description: "Quantity of the product ordered",
		},
		price: {
			type: Number,
			required: true,
			description: "Price per unit at the time of purchase",
		},
	},
	{ _id: true },
);

export type IOrderItem = {
	_id: mongoose.Types.ObjectId;
	productId: mongoose.Types.ObjectId;
	productName: string;
	productDescription: string;
	productImageUrl?: string;
	quantity: number;
	price: number;
} & mongoose.Document;
