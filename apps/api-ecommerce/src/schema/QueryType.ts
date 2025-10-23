import { GraphQLObjectType } from "graphql";

import { orderConnectionField } from "../modules/order/orderFields";
import { productConnectionField } from "../modules/product/productFields";

export const QueryType = new GraphQLObjectType({
	name: "Query",
	fields: () => ({
		...productConnectionField("products"),
		...orderConnectionField("orders"),
	}),
});
