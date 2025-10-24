import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId, toGlobalId } from "graphql-relay";
import { PUB_SUB_EVENTS } from "../../_pubSub/pubSubEvents";
import { redisPubSub } from "../../_pubSub/redisPubSub";

import { Message } from "../MessageModel";
import { messageField } from "../messageFields";

export type MessageAddInput = {
	content: string;
};

const mutation = mutationWithClientMutationId({
	name: "MessageAdd",
	inputFields: {
		content: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async (args: MessageAddInput) => {
		const message = await new Message({
			content: args.content,
		}).save();

		redisPubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
			message: message._id.toString(),
		});

		return {
			message: message._id.toString(),
		};
	},
	outputFields: {
		...messageField("message"),
	},
});

export const MessageAddMutation = {
	...mutation,
};
