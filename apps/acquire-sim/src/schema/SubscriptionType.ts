import { GraphQLObjectType } from "graphql";

import { messageSubscriptions } from "../modules/spyMessage/subscriptions/spyMessageSubscriptions";

export const SubscriptionType = new GraphQLObjectType({
	name: "Subscription",
	fields: () => ({
		...messageSubscriptions,
	}),
});
