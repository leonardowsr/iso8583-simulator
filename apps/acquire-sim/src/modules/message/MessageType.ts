import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import type { ConnectionArguments } from "graphql-relay";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { nodeInterface, registerTypeLoader } from "../_node/typeRegister";
import { MessageLoader } from "./MessageLoader";
import type { IMessage } from "./MessageModel";

const MessageType = new GraphQLObjectType<IMessage>({
	name: "Message",
	description: "Represents a message",
	fields: () => ({
		id: globalIdField("Message"),
		content: {
			type: GraphQLString,
			resolve: (message) => message.content,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (message) => message.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

const MessageConnection = connectionDefinitions({
	name: "Message",
	nodeType: MessageType,
});

registerTypeLoader(MessageType, MessageLoader.load);

export { MessageType, MessageConnection };
