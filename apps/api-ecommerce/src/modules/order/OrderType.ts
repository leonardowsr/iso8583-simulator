import {
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { registerTypeLoader } from "../_node/typeRegister";
import { OrderItemType } from "../orderItem/OrderItemType";
import { OrderLoader } from "./OrderLoader";
import type { IOrder } from "./OrderModel";

const OrderType = new GraphQLObjectType<IOrder>({
	name: "Order",
	description: "Represents a product",
	fields: () => ({
		id: globalIdField("Order"),
		code: {
			type: GraphQLString,
			resolve: (order) => order.code,
		},
		userId: {
			type: GraphQLString,
			resolve: (order) => order.userId,
		},
		orderItems: {
			type: new GraphQLNonNull(new GraphQLList(OrderItemType)),
			resolve: (order) => order.orderItems,
		},
		status: {
			type: GraphQLString,
			resolve: (order) => order.status,
		},
		price: {
			type: GraphQLInt,
			resolve: (order) => order.price,
		},
		acquiretransactionId: {
			type: GraphQLString,
			resolve: (order) => order.acquiretransactionId,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (order) => order.createdAt.toISOString(),
		},
	}),
});

const OrderConnection = connectionDefinitions({
	name: "Order",
	nodeType: OrderType,
});

registerTypeLoader(OrderType, OrderLoader.load);

export { OrderType, OrderConnection };
