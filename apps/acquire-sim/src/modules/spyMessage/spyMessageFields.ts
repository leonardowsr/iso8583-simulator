import type {
	BaseContext,
	FilteredConnectionArguments,
} from "@entria/graphql-mongo-helpers/lib/createLoader";
import { connectionArgs } from "graphql-relay";
import { SpyMessageLoader } from "./SpyMessageLoader";
import type { ISpyMessage } from "./SpyMessageModel";
import { SpyMessageConnection, SpyMessageType } from "./SpyMessageType";

type SpyMessageConnectionArgs = FilteredConnectionArguments;
type SpyMessageContext = BaseContext<"SpyMessageLoader", ISpyMessage>;

export const spyMessageField = (key: string) => ({
	[key]: {
		type: SpyMessageType,
		resolve: async (
			obj: Record<string, unknown>,
			_unused: unknown,
			context: SpyMessageContext,
		) => SpyMessageLoader.load(context, obj.spyMessage as string),
	},
});

export const spyMessageConnectionField = (key: string) => ({
	[key]: {
		type: SpyMessageConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (
			_: unknown,
			args: SpyMessageConnectionArgs,
			context: SpyMessageContext,
		) => {
			return await SpyMessageLoader.loadAll(context, args);
		},
	},
});
