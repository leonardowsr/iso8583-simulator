import { connectionArgs } from "graphql-relay";
import { SpyMessageLoader } from "./SpyMessageLoader";
import { SpyMessageConnection, SpyMessageType } from "./SpyMessageType";

export const spyMessageField = (key: string) => ({
	[key]: {
		type: SpyMessageType,
		resolve: async (obj: Record<string, unknown>, _, context) =>
			SpyMessageLoader.load(context, obj.spyMessage as string),
	},
});

export const spyMessageConnectionField = (key: string) => ({
	[key]: {
		type: SpyMessageConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (_, args, context) => {
			return await SpyMessageLoader.loadAll(context, args);
		},
	},
});
