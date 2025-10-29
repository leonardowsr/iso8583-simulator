import type {
	BaseContext,
	FilteredConnectionArguments,
} from "@entria/graphql-mongo-helpers/lib/createLoader";
import { GraphQLString } from "graphql";
import { connectionArgs } from "graphql-relay";
import { IsoMessageLoader } from "./isoMessageLoader";
import type { IIsoMessage } from "./isoMessageModel";
import { IsoMessageConnection, IsoMessageType } from "./isoMessageType";

type IsoMessageConnectionArgs = FilteredConnectionArguments;
type IsoMessageContext = BaseContext<"IsoMessageLoader", IIsoMessage>;

export const isoMessageField = (key: string) => ({
	[key]: {
		type: IsoMessageType,
		resolve: async (
			obj: Record<string, unknown>,
			_unused: unknown,
			context: IsoMessageContext,
		) => IsoMessageLoader.load(context, obj.isoMessage as string),
	},
});

export const isoMessageConnectionField = (key: string) => ({
	[key]: {
		type: IsoMessageConnection.connectionType,
		args: {
			...connectionArgs,
			direction: { type: GraphQLString },
		},
		resolve: async (
			_: unknown,
			args: IsoMessageConnectionArgs & { direction?: string },
			context: IsoMessageContext,
		) => {
			const filters: Record<string, unknown> = {};

			if (args.direction) {
				filters.direction = args.direction;
			}

			return await IsoMessageLoader.loadAll(context, { ...args, filters });
		},
	},
});
