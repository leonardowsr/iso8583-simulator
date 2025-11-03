const {
	mutateAndGetPayload,
} = require("../mutations/OrderAddMutation.runtime");
const { Product } = require("../../product/ProductModel");
const { Order } = require("../OrderModel");

jest.mock("../../product/ProductModel", () => ({
	Product: {
		find: jest.fn(),
	},
}));

jest.mock("../OrderModel", () => ({
	Order: {
		create: jest.fn(),
	},
}));

jest.mock("@fintech/shared", () => ({
	validateZod: jest.fn(),
	ValidationError: class ValidationError extends Error {},
}));

jest.mock("graphql-relay", () => ({
	fromGlobalId: jest.fn((g) => {
		// assume global id structured as 'gid:Type:id' or simply return input if already id
		if (g && typeof g === "string" && g.startsWith("gid:")) {
			return { id: g.split(":").pop() };
		}
		return { id: g };
	}),
}));

const mockedProduct = Product;
const mockedOrder = Order;
const { validateZod } = require("@fintech/shared");
const { fromGlobalId } = require("graphql-relay");

describe("OrderAddMutation", () => {
	beforeEach(() => jest.clearAllMocks());

	it("creates order successfully and calculates total & maps userId", async () => {
		const args = {
			userId: "gid:User:usr-1",
			items: [
				{ productId: "gid:Product:p1", quantity: 2 },
				{ productId: "gid:Product:p2", quantity: 1 },
			],
		};

		// Products returned from DB
		mockedProduct.find.mockResolvedValue([
			{
				_id: { toString: () => "p1" },
				price: 10,
				name: "A",
				description: "a",
				images: ["i1"],
			},
			{
				_id: { toString: () => "p2" },
				price: 5,
				name: "B",
				description: "b",
				images: ["i2"],
			},
		]);

		mockedOrder.create.mockResolvedValue({
			_id: { toString: () => "order-1" },
		});

		const result = await mutateAndGetPayload(JSON.parse(JSON.stringify(args)));

		expect(validateZod).toHaveBeenCalled();
		expect(fromGlobalId).toHaveBeenCalledWith("gid:Product:p1");
		expect(fromGlobalId).toHaveBeenCalledWith("gid:Product:p2");
		// total = 2*10 + 1*5 = 25
		expect(mockedOrder.create).toHaveBeenCalledWith(
			expect.objectContaining({ price: 25 }),
		);
		expect(result).toEqual({ order: "order-1" });
	});

	it("throws when a product is missing (length mismatch)", async () => {
		const args = {
			userId: "usr-1",
			items: [
				{ productId: "p1", quantity: 1 },
				{ productId: "p2", quantity: 1 },
			],
		};

		// only one product found
		mockedProduct.find.mockResolvedValue([
			{ _id: { toString: () => "p1" }, price: 10 },
		]);

		await expect(mutateAndGetPayload(args)).rejects.toThrow(
			"Um ou mais produtos não foram encontrados",
		);
		expect(mockedOrder.create).not.toHaveBeenCalled();
	});

	it("uses fromGlobalId to decode userId", async () => {
		const args = {
			userId: "gid:User:usr-42",
			items: [{ productId: "gid:Product:p1", quantity: 1 }],
		};

		mockedProduct.find.mockResolvedValue([
			{
				_id: { toString: () => "p1" },
				price: 7,
				name: "X",
				description: "x",
				images: [],
			},
		]);
		mockedOrder.create.mockResolvedValue({ _id: { toString: () => "ord-42" } });

		const result = await mutateAndGetPayload(args);

		// fromGlobalId should have been called for user id
		expect(fromGlobalId).toHaveBeenCalledWith("gid:User:usr-42");
		expect(mockedOrder.create).toHaveBeenCalledWith(
			expect.objectContaining({ userId: "usr-42" }),
		);
		expect(result).toEqual({ order: "ord-42" });
	});
});
