import { GraphQLObjectType } from "graphql";
import { categoryConnectionField } from "../modules/category/categoryFields";
import { orderConnectionField } from "../modules/order/orderFields";
import { productConnectionField } from "../modules/product/productFields";
import type { GQLContext } from "../server/context";

export const QueryType = new GraphQLObjectType<unknown, GQLContext>({
	name: "Query",
	fields: () => ({
		...productConnectionField("products"),
		...orderConnectionField("orders"),
		...categoryConnectionField("categories"),
	}),
});
