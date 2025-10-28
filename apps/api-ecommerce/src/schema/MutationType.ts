import { GraphQLObjectType } from "graphql";
import { orderMutations } from "../modules/order/mutations/orderMutations";
import { productMutations } from "../modules/product/mutations/productMutations";
import type { GQLContext } from "../server/context";

export const MutationType = new GraphQLObjectType<unknown, GQLContext>({
	name: "Mutation",
	fields: () => ({
		...productMutations,
		...orderMutations,
	}),
});
