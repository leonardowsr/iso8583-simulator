import { GraphQLObjectType } from "graphql";

import { messageConnectionField } from "../modules/message/messageFields";
import { productConnectionField } from "../modules/product/productFields";

export const QueryType = new GraphQLObjectType({
	name: "Query",
	fields: () => ({
		...messageConnectionField("messages"),
		...productConnectionField("products"),
	}),
});
