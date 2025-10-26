import { GraphQLObjectType } from "graphql";
import { spyMessageConnectionField } from "../modules/spyMessage/spyMessageFields";
import { transactionConnectionField } from "../modules/transaction/transactionFields";

export const QueryType = new GraphQLObjectType({
	name: "Query",
	fields: () => ({
		...spyMessageConnectionField("messages"),
		...transactionConnectionField("transactions"),
	}),
});
