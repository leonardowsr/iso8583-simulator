import { subscriptionWithClientId } from "graphql-relay-subscription";
import { withFilter } from "graphql-subscriptions";
import { PUB_SUB_EVENTS } from "../../_pubSub/pubSubEvents";
import { redisPubSub } from "../../_pubSub/redisPubSub";
import { isoMessageField } from "../isoMessageFields";
import { IsoMessage } from "../isoMessageModel";

type IsoMessageAddedPayload = {
	isoMessage: string;
};

const subscription = subscriptionWithClientId({
	name: "IsoMessageAdded",
	subscribe: withFilter(
		() => redisPubSub.asyncIterator(PUB_SUB_EVENTS.MESSAGE.ADDED),
		async (payload: IsoMessageAddedPayload) => {
			const isoMessage = await IsoMessage.findOne({
				_id: payload.isoMessage,
			});

			if (!isoMessage) {
				return false;
			}

			console.info("MessageAddedSubscription payload:", payload);
			return true;
		},
	),
	getPayload: async (obj: IsoMessageAddedPayload) => ({
		isoMessage: obj?.isoMessage,
	}),
	outputFields: {
		...isoMessageField("isoMessage"),
	},
});

export const IsoMessageAddedSubscription = {
	...subscription,
};
