import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";
import type { IOrderItem } from "./OrderItemModel";

export const OrderItemType = new GraphQLObjectType<IOrderItem>({
	name: "OrderItem",
	description: "Represents an item in an order",
	fields: () => ({
		id: globalIdField("OrderItem"),
		productId: {
			type: GraphQLString,
			resolve: (item) => item.productId.toString(),
		},
		name: {
			type: GraphQLString,
			resolve: (item) => item.name,
		},
		quantity: {
			type: GraphQLInt,
			resolve: (item) => item.quantity,
		},
		price: {
			type: GraphQLInt,
			resolve: (item) => item.price,
		},
	}),
});
