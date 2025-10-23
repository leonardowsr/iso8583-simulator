import {
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLList,
	GraphQLString,
} from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Product } from "../../product/ProductModel";
import { Order } from "../OrderModel";
import { orderField } from "../orderFields";

export type inputOrderAdd = {
	userId: string;
	items: { productId: string; quantity: number }[];
};

export const mutation = mutationWithClientMutationId({
	name: "OrderAdd",
	inputFields: {
		userId: {
			type: GraphQLString,
		},
		items: {
			type: new GraphQLList(
				new GraphQLInputObjectType({
					name: "OrderItemInput",
					fields: {
						productId: { type: GraphQLString },
						quantity: { type: GraphQLInt },
					},
				}),
			),
		},
	},
	mutateAndGetPayload: async (args: inputOrderAdd) => {
		const mappedProducts = args.items.map((p) => p.productId);
		const products = await Product.find({ _id: { $in: mappedProducts } });

		if (products.length !== mappedProducts.length) {
			throw new Error("Um ou mais produtos não foram encontrados");
		}

		let totalValor = 0;
		const orderItems = [];

		for (const p of products) {
			const item = args.items.find((i) => i.productId === p._id.toString());
			if (item) {
				totalValor += p.price * item.quantity;
				orderItems.push({
					productId: p._id,
					productName: p.name,
					productDescription: p.description,
					productImageUrl: p.image_url,
					quantity: item.quantity,
					price: p.price,
				});
			}
		}

		const order = await Order.create({
			code: `ORDER-${Date.now()}`,
			userId: args.userId,
			orderItems,
			price: totalValor,
		});

		return { order: order._id.toString() };
	},
	outputFields: {
		...orderField("order"),
	},
});

export const OrderAddMutation = {
	...mutation,
};
