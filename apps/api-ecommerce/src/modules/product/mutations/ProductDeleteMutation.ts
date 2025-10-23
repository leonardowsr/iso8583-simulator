import { GraphQLID, GraphQLNonNull } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Product } from "../ProductModel";
import { productField } from "../productFields";
import type { ProductUpdateInput } from "../schemas";

const mutation = mutationWithClientMutationId({
	name: "ProductDelete",
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
	},

	mutateAndGetPayload: async (args: ProductUpdateInput) => {
		const product = await Product.findByIdAndDelete(args.id);

		if (!product) {
			throw new Error("Produto não encontrado");
		}

		return {
			product: product._id.toString(),
		};
	},
	outputFields: {
		...productField("product"),
	},
});

export const ProductDeleteMutation = {
	...mutation,
};
