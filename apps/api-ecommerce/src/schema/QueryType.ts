import { GraphQLObjectType } from "graphql";
import { categoryConnectionField } from "../modules/category/categoryFields";
import { orderConnectionField } from "../modules/order/orderFields";
import {
	productBySlugField as productBySlug,
	productConnectionField,
} from "../modules/product/productFields";
import { userConnectionField } from "../modules/user/UserFields";
import type { GQLContext } from "../server/context";

export const QueryType = new GraphQLObjectType<unknown, GQLContext>({
	name: "Query",
	fields: () => ({
		...productConnectionField("products"),
		...orderConnectionField("orders"),
		...categoryConnectionField("categories"),
		...userConnectionField("users"),
		productBySlug,
	}),
});
