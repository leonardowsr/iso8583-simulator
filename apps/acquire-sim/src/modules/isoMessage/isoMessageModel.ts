import type { Document, Model } from "mongoose";
import mongoose from "mongoose";

export enum Edirection {
	INCOMING = "in",
	OUTGOING = "out",
}

const Schema = new mongoose.Schema<IIsoMessage>(
	{
		idempotencyKey: {
			type: String,
			required: true,
		},
		transactionId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Transaction",
		},
		direction: {
			type: String,
			enum: Edirection,
			required: true,
		},
		rawContent: { type: String, required: true },
		isoResponseCode: { type: String, required: false },
		relatedMessage: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
			ref: "IsoMessages",
		},
	},
	{
		collection: "IsoMessages",
		timestamps: true,
	},
);

export type IIsoMessage = {
	idempotencyKey: string;
	isoResponseCode: string;
	direction: Edirection;
	transactionId: mongoose.Types.ObjectId;
	rawContent: string;
	relatedMessage?: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const IsoMessage: Model<IIsoMessage> = mongoose.model(
	"IsoMessages",
	Schema,
);
