import {
	GraphQLFloat,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { registerTypeLoader } from "../_node/typeRegister";
import { ProductLoader } from "./ProductLoader";
import type { IProduct } from "./ProductModel";

const ProductType = new GraphQLObjectType<IProduct>({
	name: "Product",
	description: "Represents a product",
	fields: () => ({
		id: globalIdField("Product"),
		name: {
			type: GraphQLString,
			resolve: (product) => product.name,
		},
		price: {
			type: GraphQLInt,
			resolve: (product) => product.price,
		},
		description: {
			type: GraphQLString,
			resolve: (product) => product.description,
		},
		images: {
			type: new GraphQLList(GraphQLString),
			resolve: (product) => product.images,
		},
		slug: {
			type: GraphQLString,
			resolve: (product) => product.slug,
		},
		category: {
			type: GraphQLString,
			resolve: (product) => product.category.toString(),
		},
		createdAt: {
			type: GraphQLString,
			resolve: (product) => product.createdAt.toISOString(),
		},
	}),
});

const ProductConnection = connectionDefinitions({
	name: "Product",
	nodeType: ProductType,
	connectionFields: {
		count: {
			type: GraphQLInt,
			description: "Total number of products",
			resolve: (connection) => connection.count,
		},
	},
});

registerTypeLoader(ProductType, ProductLoader.load);

export { ProductType, ProductConnection };
