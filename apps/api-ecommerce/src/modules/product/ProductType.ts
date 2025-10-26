import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";
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
			type: GraphQLFloat,
			resolve: (product) => product.price,
		},
		description: {
			type: GraphQLString,
			resolve: (product) => product.description,
		},
		images: {
			type: GraphQLString,
			resolve: (product) => product.images,
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
});

registerTypeLoader(ProductType, ProductLoader.load);

export { ProductType, ProductConnection };
