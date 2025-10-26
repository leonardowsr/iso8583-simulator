import { GraphQLObjectType } from "graphql";

import { transactionMutations } from "../modules/transaction/mutations/mutations";

export const MutationType = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		...transactionMutations,
	}),
});
