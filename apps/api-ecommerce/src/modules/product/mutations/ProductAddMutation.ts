import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Product } from "../ProductModel";
import { productField } from "../productFields";
import type { ProductAddInput } from "../validation/schemas";

const mutation = mutationWithClientMutationId({
	name: "ProductAdd",
	inputFields: {
		name: {
			type: new GraphQLNonNull(GraphQLString),
		},
		description: {
			type: new GraphQLNonNull(GraphQLString),
		},
		price: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		image_url: {
			type: GraphQLString,
		},
	},

	mutateAndGetPayload: async (args: ProductAddInput) => {
		const existingProduct = await Product.findOne({ name: args.name });

		if (existingProduct) {
			throw new Error("Product with this name already exists");
		}

		const product = await Product.create({
			name: args.name,
			description: args.description,
			price: args.price,
			image_url: args.image_url,
		});

		return {
			product: product._id.toString(),
		};
	},
	outputFields: {
		...productField("product"),
	},
});

export const ProductAddMutation = {
	...mutation,
};
