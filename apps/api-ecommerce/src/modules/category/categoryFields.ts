/** biome-ignore-all lint/suspicious/noExplicitAny: change any after */

import type {
	BaseContext,
	FilteredConnectionArguments,
} from "@entria/graphql-mongo-helpers/lib/createLoader";
import { connectionArgs } from "graphql-relay";
import { CategoryLoader } from "./CategoryLoader";
import type { ICategory } from "./CategoryModel";
import { CategoryConnection, CategoryType } from "./CategoryType";

type CategoryConnectionArgs = FilteredConnectionArguments;

type CategoryContext = BaseContext<"CategoryLoader", ICategory>;

export const categoryField = (key: string) => ({
	[key]: {
		type: CategoryType,
		resolve: async (
			obj: Record<string, unknown>,
			_unused: unknown,
			context: CategoryContext,
		) => CategoryLoader.load(context, obj.category as string),
	},
});

export const categoryConnectionField = (key: string) => ({
	[key]: {
		type: CategoryConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (
			_: unknown,
			args: CategoryConnectionArgs,
			context: CategoryContext,
		) => {
			return await CategoryLoader.loadAll(context, args);
		},
	},
});
