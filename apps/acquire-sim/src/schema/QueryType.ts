import { GraphQLObjectType } from "graphql";
import { spyMessageConnectionField } from "../modules/spyMessage/spyMessageFields";
import { transactionConnectionField } from "../modules/transaction/transactionFields";
import type { GQLContext } from "../server/context";

export const QueryType = new GraphQLObjectType<unknown, GQLContext>({
	name: "Query",
	fields: () => ({
		...spyMessageConnectionField("messages"),
		...transactionConnectionField("transactions"),
	}),
});
