import mongoose, { type Document } from "mongoose";

export enum EAccountType {
	INTERNAL = "internal",
	COSTUME = "costumer",
}

const Schema = new mongoose.Schema<IAccount>(
	{
		cardHolderName: { type: String, required: true },
		accountType: {
			type: String,
			required: true,
			enum: EAccountType,
			default: EAccountType.COSTUME,
		},
		expiryDate: { type: String },
		balance: { type: Number, required: true, default: 1000000 },
		cardNumber: { type: String, required: true, unique: true, sparse: true },
	},
	{
		collection: "accounts",
		timestamps: true,
	},
);

export type IAccount = {
	cardHolderName: string;
	balance: number;
	accountType: EAccountType;
	cardNumber: string;
	expiryDate: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const Accounts = mongoose.model<IAccount>("accounts", Schema);
