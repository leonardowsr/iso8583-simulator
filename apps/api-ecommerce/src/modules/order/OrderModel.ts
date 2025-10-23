import mongoose, { type Document, type Model } from "mongoose";
import {
	type IOrderItem,
	Schema as OrderItemSchema,
} from "../orderItem/OrderItemModel";

export enum EOrderStatus {
	PENDING = "pending",
	PAID = "paid",
	FAILED = "failed",
}

const Schema = new mongoose.Schema<IOrder>(
	{
		userId: {
			required: true,
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			description: "Reference to the user who placed the order",
			index: true,
		},
		code: {
			type: String,
			required: false,
			description: "Unique code of the order",
			unique: true,
			default: () => `ORD-${Date.now()}`,
		},
		status: {
			type: String,
			enum: EOrderStatus,
			required: true,
			description: "Status of the order",
			default: EOrderStatus.PENDING,
		},
		orderItems: [OrderItemSchema],
		price: {
			type: Number,
			required: true,
			description: "Total price of the order",
		},
		acquiretransactionId: {
			type: String,
			required: false,
			description: "Acquire Transaction ID",
		},
	},
	{ collection: "Order", timestamps: true },
);

export type IOrder = {
	code: string;
	userId: mongoose.Types.ObjectId;
	status: string;
	orderItems: IOrderItem[];
	price: number;
	acquiretransactionId?: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const Order: Model<IOrder> = mongoose.model("Order", Schema);
