import { subscriptionWithClientId } from "graphql-relay-subscription";
import { withFilter } from "graphql-subscriptions";
import { PUB_SUB_EVENTS } from "../../_pubSub/pubSubEvents";
import { redisPubSub } from "../../_pubSub/redisPubSub";
import { Message } from "../MessageModel";
import { messageField } from "../messageFields";

type MessageAddedPayload = {
	message: string;
};

const subscription = subscriptionWithClientId({
	name: "MessageAdded",
	subscribe: withFilter(
		() => redisPubSub.asyncIterator(PUB_SUB_EVENTS.MESSAGE.ADDED),
		async (payload: MessageAddedPayload, context) => {
			const message = await Message.findOne({
				_id: payload.message,
			});

			if (!message) {
				return false;
			}
			console.info("MessageAddedSubscription payload:", payload);
			return true;
		},
	),
	getPayload: async (obj: MessageAddedPayload) => ({
		message: obj?.message,
	}),
	outputFields: {
		...messageField("message"),
	},
});

export const MessageAddedSubscription = {
	...subscription,
};
