import { validateZod } from "@woovi-playground/shared";
import {
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString,
} from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Category } from "../../category/CategoryModel";
import { Product } from "../ProductModel";
import { productField } from "../productFields";
import { ProductAddInput, productAddSchema } from "../productSchemas";

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
		category: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},

	mutateAndGetPayload: async (args: ProductAddInput) => {
		validateZod(productAddSchema, args);
		const [existingProduct, category] = await Promise.all([
			Product.findOne({ name: args.name }),
			Category.findById(args.category),
		]);

		if (existingProduct) {
			throw new Error("Product with this name already exists");
		}

		if (!category) {
			throw new Error("Category not found");
		}
		const product = await Product.create({
			name: args.name,
			description: args.description,
			price: args.price,
			slug: args.slug,
			images: args.images,
			category: args.category,
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
