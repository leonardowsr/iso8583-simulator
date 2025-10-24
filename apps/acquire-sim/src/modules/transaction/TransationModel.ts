import mongoose, { type Document, type Model } from "mongoose";

export enum ETransactionStatus {
	PENDING = "pending",
	COMPLETED = "completed",
	FAILED = "failed",
}

export const Schema = new mongoose.Schema<ITransaction>(
	{
		userId: { type: String, required: true },
		orderRef: { type: String, required: true },
		status: {
			type: String,
			enum: Object.values(ETransactionStatus),
			default: ETransactionStatus.PENDING,
			required: true,
		},
		amount: { type: Number, required: true },
		idepotencyKey: { type: String, required: false },
		createdAt: { type: Date, default: Date.now },
		cardLastFour: { type: String, required: false },
	},
	{ collection: "Transaction", timestamps: true },
);

export type ITransaction = {
	orderRef: string;
	userId: string;
	amount: number;
	cardLastFour: string;
	idepotencyKey?: string;
	status: ETransactionStatus;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const Transaction: Model<ITransaction> = mongoose.model(
	"Transaction",
	Schema,
);
