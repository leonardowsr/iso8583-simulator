import mongoose, { type Document } from "mongoose";

export enum AccountType {
	INTERNAL = "internal",
	COSTUME = "costumer",
}

const Schema = new mongoose.Schema<IAccount>(
	{
		cardHolderName: { type: String, required: true },
		accountType: {
			type: String,
			required: true,
			enum: AccountType,
			default: AccountType.COSTUME,
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
	accountType: AccountType;
	cardNumber: string;
	expiryDate: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const Accounts = mongoose.model<IAccount>("accounts", Schema);
