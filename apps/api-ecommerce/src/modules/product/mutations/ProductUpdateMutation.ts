import { removeUndefined } from "@woovi-playground/shared";
import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Product } from "../ProductModel";
import { productField } from "../productFields";
import type { ProductUpdateInput } from "../schemas";

const mutation = mutationWithClientMutationId({
	name: "ProductUpdate",
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
		name: {
			type: GraphQLString,
		},
		description: {
			type: GraphQLString,
		},
		price: {
			type: GraphQLInt,
		},
		images: {
			type: GraphQLString,
		},
		category: {
			type: GraphQLString,
		},
	},

	mutateAndGetPayload: async (args: ProductUpdateInput) => {
		const updates = removeUndefined({
			name: args.name,
			description: args.description,
			price: args.price,
			images: args.images,
			category: args.category,
		});

		if (Object.keys(updates).length === 0) {
			throw new Error("No fields to update");
		}

		const product = await Product.findByIdAndUpdate(
			args.id,
			{ $set: updates },
			{ new: true, runValidators: true },
		);

		if (!product) {
			throw new Error("Product not found");
		}

		return {
			product: product._id.toString(),
		};
	},
	outputFields: {
		...productField("product"),
	},
});

export const ProductUpdateMutation = {
	...mutation,
};
