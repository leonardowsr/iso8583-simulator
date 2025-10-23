import { GraphQLObjectType } from "graphql";

import { messageMutations } from "../modules/message/mutations/messageMutations";
import { productMutations } from "../modules/product/mutations/productMutations";

export const MutationType = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		...messageMutations,
		...productMutations,
	}),
});
