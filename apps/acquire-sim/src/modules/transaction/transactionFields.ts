import type {
	BaseContext,
	FilteredConnectionArguments,
} from "@entria/graphql-mongo-helpers/lib/createLoader";
import { connectionArgs } from "graphql-relay";
import { TransactionLoader } from "./TransactionLoader";
import { TransactionConnection, TransactionType } from "./TransactionType";
import type { ITransaction } from "./TransationModel";

type TransactionConnectionArgs = FilteredConnectionArguments;
type TransactionContext = BaseContext<"TransactionLoader", ITransaction>;

export const transactionField = (key: string) => ({
	[key]: {
		type: TransactionType,
		resolve: async (
			obj: Record<string, unknown>,
			_unused: unknown,
			context: TransactionContext,
		) => TransactionLoader.load(context, obj.transaction as string),
	},
});

export const transactionConnectionField = (key: string) => ({
	[key]: {
		type: TransactionConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (
			_: unknown,
			args: TransactionConnectionArgs,
			context: TransactionContext,
		) => {
			return await TransactionLoader.loadAll(context, args);
		},
	},
});
