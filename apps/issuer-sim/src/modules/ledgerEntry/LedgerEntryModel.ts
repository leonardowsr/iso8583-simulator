import mongoose, { type Model } from "mongoose";

export enum EledgerEntryType {
	CASHIN = "cashin",
	CASHOUT = "cashout",
}

const Schema = new mongoose.Schema<ILedgerEntry>(
	{
		amount: { type: Number, required: true },
		accountId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "accounts",
		},
		type: {
			type: String,
			required: true,
			enum: EledgerEntryType,
		},
		createdAt: { type: Date, default: Date.now },
		idempotencyKey: { type: String, required: true },
	},
	{
		collection: "ledgerEntries",
		timestamps: true,
	},
);

export type ILedgerEntry = {
	amount: number;
	accountId: mongoose.Types.ObjectId;
	idempotencyKey: string;
	type: EledgerEntryType;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const LedgerEntries: Model<ILedgerEntry> = mongoose.model<ILedgerEntry>(
	"ledgerEntries",
	Schema,
);
