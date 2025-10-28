import type {
	BaseContext,
	FilteredConnectionArguments,
} from "@entria/graphql-mongo-helpers/lib/createLoader";
import {
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString,
} from "graphql";
import { connectionArgs } from "graphql-relay";
import { Category } from "../category/CategoryModel";
import { ProductLoader } from "./ProductLoader";
import { type IProduct, Product } from "./ProductModel";
import { ProductConnection, ProductType } from "./ProductType";

type GQLContext = BaseContext<"ProductLoader", IProduct>;

type ProductConnectionArgs = FilteredConnectionArguments & {
	search?: string;
	categories?: string[];
	minPrice?: number | null;
	maxPrice?: number | null;
};

export const productBySlugField = {
	type: ProductType,
	args: { slug: { type: new GraphQLNonNull(GraphQLString) } },
	resolve: async (
		_parent: unknown,
		{ slug }: { slug: string },
		context: GQLContext,
	) => {
		const product = await Product.findOne({ slug }).lean();
		return product ? ProductLoader.load(context, product._id) : null;
	},
};

export const productField = (key: string) => ({
	[key]: {
		type: ProductType,
		resolve: async (
			obj: Record<string, unknown>,
			_unused: unknown,
			context: GQLContext,
		) => ProductLoader.load(context, obj.product as string),
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
		resolve: async (
			_parent: unknown,
			args: ProductConnectionArgs,
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
			return await ProductLoader.loadAll(context, {
				...args,
				filters,
			} as FilteredConnectionArguments);
		},
	},
});
