import { GraphQLObjectType, GraphQLString } from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { nodeInterface, registerTypeLoader } from "../_node/typeRegister";
import { SpyMessageLoader } from "./SpyMessageLoader";
import type { ISpyMessage } from "./SpyMessageModel";

const SpyMessageType = new GraphQLObjectType<ISpyMessage>({
	name: "SpyMessage",
	description: "Represents a spyMessage",
	fields: () => ({
		id: globalIdField("SpyMessage"),
		rawContent: {
			type: GraphQLString,
			resolve: (spyMessage) => spyMessage.rawContent,
		},
		isoResponseCode: {
			type: GraphQLString,
			resolve: (spyMessage) => spyMessage.isoResponseCode,
		},
		direction: {
			type: GraphQLString,
			resolve: (spyMessage) => spyMessage.direction,
		},
		transactionId: {
			type: GraphQLString,
			resolve: (spyMessage) => spyMessage.transactionId.toString(),
		},
		idempotencyKey: {
			type: GraphQLString,
			resolve: (spyMessage) => spyMessage.idempotencyKey,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (spyMessage) => spyMessage.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

const SpyMessageConnection = connectionDefinitions({
	name: "SpyMessage",
	nodeType: SpyMessageType,
});

registerTypeLoader(SpyMessageType, SpyMessageLoader.load);

export { SpyMessageType, SpyMessageConnection };
