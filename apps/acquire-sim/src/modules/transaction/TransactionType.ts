import {
	GraphQLFloat,
	GraphQLID,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import { connectionDefinitions } from "graphql-relay";
import { registerTypeLoader } from "../_node/typeRegister";
import { TransactionLoader } from "./TransactionLoader";
import type { ITransaction } from "./TransationModel";

const TransactionType = new GraphQLObjectType<ITransaction>({
	name: "Transaction",
	description: "Represents a transaction",
	fields: {
		id: {
			type: GraphQLID,
			resolve: (transaction) => transaction._id.toString(),
		},
		userId: {
			type: GraphQLString,
			resolve: (transaction) => transaction.userId,
		},
		orderRef: {
			type: GraphQLString,
			resolve: (transaction) => transaction.orderRef,
		},
		status: {
			type: GraphQLString,
			resolve: (transaction) => transaction.status,
		},
		amount: {
			type: GraphQLFloat,
			resolve: (transaction) => transaction.amount,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (transaction) => transaction.createdAt,
		},
		updatedAt: {
			type: GraphQLString,
			resolve: (transaction) => transaction.updatedAt,
		},
	},
});

const TransactionConnection = connectionDefinitions({
	name: "Transaction",
	nodeType: TransactionType,
});

registerTypeLoader(TransactionType, TransactionLoader.load);

export { TransactionType, TransactionConnection };
