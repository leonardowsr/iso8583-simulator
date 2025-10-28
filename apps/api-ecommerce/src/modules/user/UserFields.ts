import type {
	BaseContext,
	FilteredConnectionArguments,
} from "@entria/graphql-mongo-helpers/lib/createLoader";
import { GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import { connectionArgs } from "graphql-relay";
import { Category } from "../category/CategoryModel";
import { UserLoader } from "./UserLoader";
import type { IUser } from "./UserModel";
import { UserConnection, UserType } from "./UserType";

type GQLContext = BaseContext<"UserLoader", IUser>;

type UserConnectionArgs = FilteredConnectionArguments & {
	search?: string;
	categories?: string[];
	minPrice?: number | null;
	maxPrice?: number | null;
};

export const userField = (key: string) => ({
	[key]: {
		type: UserType,
		resolve: async (
			obj: Record<string, unknown>,
			_unused: unknown,
			context: GQLContext,
		) => UserLoader.load(context, obj.user as string),
	},
});

export const userConnectionField = (key: string) => ({
	[key]: {
		type: UserConnection.connectionType,
		args: {
			...connectionArgs,
			search: { type: GraphQLString },
			categories: { type: new GraphQLList(GraphQLString) },
			minPrice: { type: GraphQLInt },
			maxPrice: { type: GraphQLInt },
		},
		resolve: async (
			_parent: unknown,
			args: UserConnectionArgs,
			context: GQLContext,
		) => {
			const filters: Record<string, unknown> = {};

			if (args.search) {
				filters.name = { $regex: new RegExp(`^${String(args.search)}`, "i") };
			}

			if (args.categories && args.categories.length > 0) {
				const categoriesIds = await Category.find(
					{
						slug: { $in: args.categories },
					},
					{ _id: 1 },
				).lean();
				filters.category = { $in: categoriesIds.map((cat) => cat._id) };
			}
			if (args.minPrice != null) {
				filters.price = {
					...(filters.price as Record<string, unknown>),
					$gte: args.minPrice,
				};
			}
			if (args.maxPrice != null) {
				filters.price = {
					...(filters.price as Record<string, unknown>),
					$lte: args.maxPrice,
				};
			}
			return await UserLoader.loadAll(context, {
				...args,
				filters,
			} as FilteredConnectionArguments);
		},
	},
});
