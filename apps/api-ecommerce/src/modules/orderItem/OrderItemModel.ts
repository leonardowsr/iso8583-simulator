import mongoose from "mongoose";

export const Schema = new mongoose.Schema<IOrderItem>(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
			description: "Reference to the product",
		},
		name: {
			type: String,
			required: true,
			description: "Product name at the time of purchase",
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
	name: string;
	quantity: number;
	price: number;
} & mongoose.Document;
