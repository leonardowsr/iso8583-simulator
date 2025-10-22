import type { BaseContext } from "@entria/graphql-mongo-helpers/lib/createLoader";
import { connectionArgs } from "graphql-relay";
import { MessageLoader } from "./MessageLoader";
import type { IMessage } from "./MessageModel";
import { MessageConnection, MessageType } from "./MessageType";

export const messageField = (key: string) => ({
	[key]: {
		type: MessageType,
		resolve: async (
			obj: Record<string, unknown>,
			_: any,
			context: BaseContext<"MessageLoader", IMessage>,
		) => MessageLoader.load(context, obj.message as string),
	},
});

export const messageConnectionField = (key: string) => ({
	[key]: {
		type: MessageConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (_: any, args: any, context: any) => {
			return await MessageLoader.loadAll(context, args);
		},
	},
});
