import { GraphQLObjectType } from "graphql";

import { spyMessageSubscriptions } from "../modules/spyMessage/subscriptions/spyMessageSubscriptions";

export const SubscriptionType = new GraphQLObjectType({
	name: "Subscription",
	fields: () => ({
		...spyMessageSubscriptions,
	}),
});
