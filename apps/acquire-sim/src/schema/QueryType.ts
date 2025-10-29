import { GraphQLObjectType } from "graphql";
import { isoMessageConnectionField } from "../modules/isoMessage/isoMessageFields";
import { transactionConnectionField } from "../modules/transaction/transactionFields";
import type { GQLContext } from "../server/context";

export const QueryType = new GraphQLObjectType<unknown, GQLContext>({
	name: "Query",
	fields: () => ({
		...isoMessageConnectionField("isoMessages"),
		...transactionConnectionField("transactions"),
	}),
});
