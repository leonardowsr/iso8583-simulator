import { subscriptionWithClientId } from "graphql-relay-subscription";
import { withFilter } from "graphql-subscriptions";
import { PUB_SUB_EVENTS } from "../../_pubSub/pubSubEvents";
import { redisPubSub } from "../../_pubSub/redisPubSub";
import { SpyMessage } from "../SpyMessageModel";
import { spyMessageField } from "../spyMessageFields";

type SpyMessageAddedPayload = {
	spyMessage: string;
};

const subscription = subscriptionWithClientId({
	name: "SpyMessageAdded",
	subscribe: withFilter(
		() => redisPubSub.asyncIterator(PUB_SUB_EVENTS.MESSAGE.ADDED),
		async (payload: SpyMessageAddedPayload) => {
			const spyMessage = await SpyMessage.findOne({
				_id: payload.spyMessage,
			});

			if (!spyMessage) {
				return false;
			}

			console.info("MessageAddedSubscription payload:", payload);
			return true;
		},
	),
	getPayload: async (obj: SpyMessageAddedPayload) => ({
		spyMessage: obj?.spyMessage,
	}),
	outputFields: {
		...spyMessageField("spyMessage"),
	},
});

export const SpyMessageAddedSubscription = {
	...subscription,
};
