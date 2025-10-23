import { GraphQLObjectType } from "graphql";

import { orderMutations } from "../modules/order/mutations/orderMutations";
import { productMutations } from "../modules/product/mutations/productMutations";

export const MutationType = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		...productMutations,
		...orderMutations,
	}),
});
