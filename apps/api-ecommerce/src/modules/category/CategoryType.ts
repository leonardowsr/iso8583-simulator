import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { registerTypeLoader } from "../_node/typeRegister";
import { ProductType } from "../product/ProductType";
import { CategoryLoader } from "./CategoryLoader";
import type { ICategory } from "./CategoryModel";

const CategoryType = new GraphQLObjectType<ICategory>({
	name: "Category",
	description: "Represents a category",
	fields: () => ({
		id: globalIdField("Category"),
		name: {
			type: GraphQLString,
			resolve: (category) => category.name,
		},
		slug: {
			type: GraphQLString,
			resolve: (category) => category.slug,
		},
		products: {
			type: new GraphQLList(ProductType),
			resolve: (category) => category.products,
		},
		image: {
			type: GraphQLString,
			resolve: (category) => category.image,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (category) => category.createdAt.toISOString(),
		},
	}),
});

const CategoryConnection = connectionDefinitions({
	name: "Category",
	nodeType: CategoryType,
});

registerTypeLoader(CategoryType, CategoryLoader.load);

export { CategoryType, CategoryConnection };
