import {
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString,
} from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Product } from "../ProductModel";
import { productField } from "../productFields";
import type { ProductAddInput } from "../schemas";

const mutation = mutationWithClientMutationId({
	name: "ProductAdd",
	inputFields: {
		name: {
			type: new GraphQLNonNull(GraphQLString),
		},
		slug: {
			type: new GraphQLNonNull(GraphQLString),
		},
		description: {
			type: new GraphQLNonNull(GraphQLString),
		},
		price: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		images: {
			type: new GraphQLList(GraphQLString),
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
			slug: args.slug,
			images: args.images,
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
