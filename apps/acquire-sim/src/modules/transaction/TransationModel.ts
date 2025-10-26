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
		failedReason: { type: String, required: false },
		amount: { type: Number, required: true },
		idempotencyKey: { type: String, required: false },
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
	idempotencyKey?: string;
	status: ETransactionStatus;
	failedReason?: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const Transaction: Model<ITransaction> = mongoose.model(
	"Transaction",
	Schema,
);
