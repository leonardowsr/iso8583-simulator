import { GraphQLObjectType } from "graphql";

import { messageMutations } from "../modules/message/mutations/messageMutations";
import { transactionMutations } from "../modules/transaction/mutations/mutations";

export const MutationType = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		...messageMutations,
		...transactionMutations,
	}),
});
