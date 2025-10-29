import { GraphQLObjectType, GraphQLString } from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { nodeInterface, registerTypeLoader } from "../_node/typeRegister";
import { IsoMessageLoader } from "./isoMessageLoader";
import type { IIsoMessage } from "./isoMessageModel";

const IsoMessageType = new GraphQLObjectType<IIsoMessage>({
	name: "IsoMessage",
	description: "Represents a isoMessage",
	fields: () => ({
		id: globalIdField("IsoMessage"),
		rawContent: {
			type: GraphQLString,
			resolve: (isoMessage) => isoMessage.rawContent,
		},
		isoResponseCode: {
			type: GraphQLString,
			resolve: (isoMessage) => isoMessage.isoResponseCode,
		},
		direction: {
			type: GraphQLString,
			resolve: (isoMessage) => isoMessage.direction,
		},
		transactionId: {
			type: GraphQLString,
			resolve: (isoMessage) => isoMessage.transactionId.toString(),
		},
		idempotencyKey: {
			type: GraphQLString,
			resolve: (isoMessage) => isoMessage.idempotencyKey,
		},
		relatedMessage: {
			type: IsoMessageType,
			resolve: async (isoMessage, _args, ctx) => {
				if (!isoMessage.relatedMessage) return null;
				return IsoMessageLoader.load(ctx, isoMessage.relatedMessage.toString());
			},
		},
		createdAt: {
			type: GraphQLString,
			resolve: (isoMessage) => isoMessage.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

const IsoMessageConnection = connectionDefinitions({
	name: "IsoMessage",
	nodeType: IsoMessageType,
	connectionFields: () => ({
		direction: {
			type: GraphQLString,
			resolve: (_conn, _args, _ctx) => {
				return null;
			},
		},
	}),
});

registerTypeLoader(IsoMessageType, IsoMessageLoader.load);

export { IsoMessageType, IsoMessageConnection };
