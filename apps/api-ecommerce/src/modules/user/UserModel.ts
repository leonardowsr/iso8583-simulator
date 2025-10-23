import mongoose, { type Model } from "mongoose";

export const Schema = new mongoose.Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ collection: "User", timestamps: true },
);

export type IUser = {
	name: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const User: Model<IUser> = mongoose.model("User", Schema);
