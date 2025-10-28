import {
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLList,
	GraphQLString,
} from "graphql";
import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";
import { Product } from "../../product/ProductModel";
import { Order } from "../OrderModel";
import { orderField } from "../orderFields";

export type InputOrderAdd = {
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
						price: { type: GraphQLInt },
						productName: { type: GraphQLString },
					},
				}),
			),
		},
	},
	mutateAndGetPayload: async (args: InputOrderAdd) => {
		const decodedItems = args.items.map((item) => {
			const { id } = fromGlobalId(item.productId);
			return {
				...item,
				productId: id,
			};
		});
		const mappedProducts = decodedItems.map((p) => p.productId);
		const products = await Product.find({ _id: { $in: mappedProducts } });

		args.items = decodedItems;
		if (products.length !== mappedProducts.length) {
			throw new Error("Um ou mais produtos não foram encontrados");
		}

		let totalValor = 0;
		const orderItems = [];

		for (const p of products) {
			const item = decodedItems.find((i) => i.productId === p._id.toString());
			if (item) {
				totalValor += p.price * item.quantity;
				orderItems.push({
					productId: p._id,
					name: p.name,
					description: p.description,
					imageUrl: p.images,
					quantity: item.quantity,
					price: p.price,
				});
			}
		}

		const order = await Order.create({
			code: `ORDER-${Date.now()}`,
			userId: fromGlobalId(args.userId)?.id,
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
