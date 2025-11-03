import { validateZod } from "@fintech/shared";
import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import mongoose, { type HydratedDocument } from "mongoose";
import { resolve } from "path";
import { createIssuerAdapterFactory } from "../../../adapters/iso8583.adapter";
import { redisPubSub } from "../../_pubSub/redisPubSub";
import { IsoMessage } from "../../isoMessage/isoMessageModel";
import {
	ETransactionStatus,
	type ITransaction,
	Transaction,
} from "../TransationModel";
import { transactionField } from "../transactionFields";
import {
	type TransactionAddInput,
	transactionAddSchema,
} from "../transactionSchemas";

const mutation = mutationWithClientMutationId({
	name: "TransactionAdd",
	inputFields: {
		userId: { type: new GraphQLNonNull(GraphQLString) },
		orderRef: { type: new GraphQLNonNull(GraphQLString) },
		amount: { type: new GraphQLNonNull(GraphQLInt) },
		idempotencyKey: { type: new GraphQLNonNull(GraphQLString) },
		cardNumber: { type: new GraphQLNonNull(GraphQLString) },
		cardHolderName: { type: new GraphQLNonNull(GraphQLString) },
		cardExpiryMonth: { type: new GraphQLNonNull(GraphQLString) },
		cardExpiryYear: { type: new GraphQLNonNull(GraphQLString) },
		cardCvv: { type: new GraphQLNonNull(GraphQLString) },
	},
	mutateAndGetPayload: async (args: TransactionAddInput) => {
		validateZod(transactionAddSchema, args);
		const session = await mongoose.startSession();

		let transaction!: HydratedDocument<ITransaction>;

		await session.withTransaction(async () => {
			const existingTransaction = await Transaction.findOne({
				idempotencyKey: args.idempotencyKey,
			}).session(session);

			if (existingTransaction) {
				transaction = existingTransaction;
				return;
			}
			const newTransaction = new Transaction({
				userId: args.userId,
				orderRef: args.orderRef,
				amount: args.amount,
				idempotencyKey: args.idempotencyKey,
				cardLastFour: args.cardNumber.slice(-4),
			});

			await newTransaction.save({ session });

			transaction = newTransaction;
		});

		session.endSession();
		if (!transaction) {
			throw new Error("Transaction could not be created");
		}
		if (transaction.status !== ETransactionStatus.PENDING) {
			return { transaction: transaction._id.toString() };
		}

		try {
			const isoClient = createIssuerAdapterFactory(redisPubSub, IsoMessage);
			await new Promise((res) => setTimeout(res, 2000));
			await isoClient.sendTransaction({
				...args,
				transactionId: transaction._id.toString(),
			});
			transaction.status = ETransactionStatus.COMPLETED;
		} catch (err) {
			console.error("Error processing transaction:", err);
			transaction.status = ETransactionStatus.FAILED;
			if (err instanceof Error) {
				transaction.failedReason = err.message;
			} else {
				transaction.failedReason = err?.toString();
			}
			throw err;
		} finally {
			await transaction.save();
		}

		return {
			transaction: transaction._id.toString(),
		};
	},
	outputFields: {
		...transactionField("transaction"),
	},
});

export const transactionAddMutation = {
	...mutation,
};
