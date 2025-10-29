const { validateZod } = require("@woovi-playground/shared");
const { fromGlobalId } = require("graphql-relay");
const { Product } = require("../../product/ProductModel");
const { Order } = require("../OrderModel");

async function mutateAndGetPayload(args) {
	// validateZod will be mocked in tests
	validateZod(undefined, args);

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
}

module.exports = { mutateAndGetPayload };
