import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Iso8583Client } from "../../../adapters/iso8583.adapter";
import { PUB_SUB_EVENTS } from "../../_pubSub/pubSubEvents";
import { redisPubSub } from "../../_pubSub/redisPubSub";
import { Message } from "../../message/MessageModel";
import { Transaction } from "../TransationModel";
import { transactionField } from "../transactionFields";

export type TransactionAddInput = {
	userId: string;
	orderRef: string;
	amount: number;
	idepotencyKey: string;
	cardNumber: string;
	cardHolderName: string;
	cardExpiryMonth: string;
	cardExpiryYear: string;
	cardCvv: string;
};

const mutation = mutationWithClientMutationId({
	name: "TransactionAdd",
	inputFields: {
		userId: { type: new GraphQLNonNull(GraphQLString) },
		orderRef: { type: new GraphQLNonNull(GraphQLString) },
		amount: { type: new GraphQLNonNull(GraphQLInt) },
		idepotencyKey: { type: new GraphQLNonNull(GraphQLString) },
		cardNumber: { type: new GraphQLNonNull(GraphQLString) },
		cardHolderName: { type: new GraphQLNonNull(GraphQLString) },
		cardExpiryMonth: { type: new GraphQLNonNull(GraphQLString) },
		cardExpiryYear: { type: new GraphQLNonNull(GraphQLString) },
		cardCvv: { type: new GraphQLNonNull(GraphQLString) },
	},
	mutateAndGetPayload: async (args: TransactionAddInput) => {
		const existingTransaction = await Transaction.findOne({
			idepotencyKey: args.idepotencyKey,
		});

		if (existingTransaction) {
			return { transaction: existingTransaction._id.toString() };
		}

		if (String(args.amount).length > 12) {
			throw new Error("Valor da transação excede o limite permitido");
		}

		const isoClient = new Iso8583Client();

		const transaction = await Transaction.create({
			userId: args.userId,
			orderRef: args.orderRef,
			amount: args.amount,
			idepotencyKey: args.idepotencyKey,
			cardLastFour: args.cardNumber.slice(-4),
		});

		const message = await new Message({
			content: "IN: Processing transaction " + transaction._id,
		}).save();

		try {
			await isoClient.connect();
			redisPubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
				message: message._id.toString(),
			});

			const response = await isoClient.sendTransaction(args);
			console.log("ISO 8583 response received:", response);

			redisPubSub.publish("MESSAGE.ADDED", {
				message: message._id.toString(),
			});
		} catch (err) {
			console.error("Error processing transaction:", err);
			redisPubSub.publish("MESSAGE.ADDED", {
				message: message._id.toString(),
			});
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
