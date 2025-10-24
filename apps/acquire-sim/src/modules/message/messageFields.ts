import { connectionArgs } from "graphql-relay";
import { MessageLoader } from "./MessageLoader";
import { MessageConnection, MessageType } from "./MessageType";

export const messageField = (key: string) => ({
	[key]: {
		type: MessageType,
		resolve: async (obj: Record<string, unknown>, _, context) =>
			MessageLoader.load(context, obj.message as string),
	},
});

export const messageConnectionField = (key: string) => ({
	[key]: {
		type: MessageConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (_, args, context) => {
			return await MessageLoader.loadAll(context, args);
		},
	},
});
