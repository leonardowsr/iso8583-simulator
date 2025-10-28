import { GraphQLObjectType } from "graphql";

import { isoMessageSubscriptions } from "../modules/isoMessage/subscriptions/isoMessageSubscriptions";

export const SubscriptionType = new GraphQLObjectType({
	name: "Subscription",
	fields: () => ({
		...isoMessageSubscriptions,
	}),
});
