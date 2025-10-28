import {
	GraphQLFloat,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { registerTypeLoader } from "../_node/typeRegister";
import { UserLoader } from "./UserLoader";
import type { IUser } from "./UserModel";

const UserType = new GraphQLObjectType<IUser>({
	name: "User",
	description: "Represents a user",
	fields: () => ({
		id: globalIdField("User"),
		name: {
			type: GraphQLString,
			resolve: (user) => user.name,
		},
		email: {
			type: GraphQLString,
			resolve: (user) => user.email,
		},
		password: {
			type: GraphQLString,
			resolve: (user) => user.password,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (user) => user.createdAt.toISOString(),
		},
	}),
});

const UserConnection = connectionDefinitions({
	name: "User",
	nodeType: UserType,
});

registerTypeLoader(UserType, UserLoader.load);

export { UserType, UserConnection };
