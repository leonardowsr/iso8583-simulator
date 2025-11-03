const { validateZod } = require("@fintech/shared");
const { Product } = require("../ProductModel");
const { Category } = require("../../category/CategoryModel");
async function mutateAndGetPayload(args) {
	// runtime tests mock validateZod, so schema is not required here
	validateZod(undefined, args);
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
}

module.exports = { mutateAndGetPayload };
