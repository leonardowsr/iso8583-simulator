/** biome-ignore-all lint/suspicious/noExplicitAny: change any after */
import { connectionArgs } from "graphql-relay";
import { CategoryLoader } from "./CategoryLoader";
import { CategoryConnection, CategoryType } from "./CategoryType";

export const categoryField = (key: string) => ({
	[key]: {
		type: CategoryType,
		resolve: async (obj: Record<string, unknown>, _: any, context: any) =>
			CategoryLoader.load(context, obj.category as string),
	},
});

export const categoryConnectionField = (key: string) => ({
	[key]: {
		type: CategoryConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (_: any, args: any, context: any) => {
			return await CategoryLoader.loadAll(context, args);
		},
	},
});
