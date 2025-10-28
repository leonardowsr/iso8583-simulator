/** biome-ignore-all lint/suspicious/noExplicitAny: change any after */

import { GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import { connectionArgs } from "graphql-relay";
import { Category } from "../category/CategoryModel";
import { ProductLoader } from "./ProductLoader";
import { ProductConnection, ProductType } from "./ProductType";

export const productField = (key: string) => ({
	[key]: {
		type: ProductType,
		resolve: async (obj: Record<string, unknown>, _: any, context: any) =>
			ProductLoader.load(context, obj.product as string),
	},
});

export const productConnectionField = (key: string) => ({
	[key]: {
		type: ProductConnection.connectionType,
		args: {
			...connectionArgs,
			search: { type: GraphQLString },
			categories: { type: new GraphQLList(GraphQLString) },
			minPrice: { type: GraphQLInt },
			maxPrice: { type: GraphQLInt },
		},
		resolve: async (_, args, context) => {
			const filters: Record<string, any> = {};

			if (args.search) {
				filters.name = { $regex: new RegExp(`^${args.search}`, "i") };
			}
			// if (args.categories && args.categories.length > 0) {
			// 	filters.category = { $in: args.categories };
			// }
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
				filters.price = { ...filters.price, $gte: args.minPrice };
			}
			if (args.maxPrice != null) {
				filters.price = { ...filters.price, $lte: args.maxPrice };
			}
			console.log("filters ante de ir ao loader", filters);
			// Passe os filtros junto com os outros args
			return await ProductLoader.loadAll(context, { ...args, filters });
		},
	},
});
