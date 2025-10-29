const {
	mutateAndGetPayload,
} = require("../mutations/ProductAddMutation.runtime");
const { Product } = require("../ProductModel");
const { Category } = require("../../category/CategoryModel");

jest.mock("../ProductModel", () => ({
	Product: {
		findOne: jest.fn(),
		create: jest.fn(),
	},
}));

jest.mock("../../category/CategoryModel", () => ({
	Category: {
		findById: jest.fn(),
	},
}));

jest.mock("@woovi-playground/shared", () => ({
	validateZod: jest.fn(),
	ValidationError: class ValidationError extends Error {},
}));

const mockedProduct = Product;
const mockedCategory = Category;
const { validateZod } = require("@woovi-playground/shared");

describe("ProductAddMutation", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("creates a product successfully and returns id", async () => {
		const args = {
			name: "Test Product",
			slug: "test-product",
			description: "A product for tests",
			price: 1000,
			images: ["https://example.com/img.png"],
			category: "cat-id",
		};

		mockedProduct.findOne.mockResolvedValue(null);
		mockedCategory.findById.mockResolvedValue({
			_id: { toString: () => "cat-id" },
		});
		mockedProduct.create.mockResolvedValue({
			_id: { toString: () => "new-prod-id" },
		});

		const result = await mutateAndGetPayload(args);

		expect(validateZod).toHaveBeenCalled();
		expect(mockedProduct.findOne).toHaveBeenCalledWith({ name: args.name });
		expect(mockedCategory.findById).toHaveBeenCalledWith(args.category);
		expect(mockedProduct.create).toHaveBeenCalledWith({
			name: args.name,
			description: args.description,
			price: args.price,
			slug: args.slug,
			images: args.images,
			category: args.category,
		});
		expect(result).toEqual({ product: "new-prod-id" });
	});

	it("throws when a product with same name exists", async () => {
		const args = {
			name: "Existing",
			slug: "existing",
			description: "desc",
			price: 10,
			images: [],
			category: "cat-id",
		};

		mockedProduct.findOne.mockResolvedValue({ _id: "exists" });
		mockedCategory.findById.mockResolvedValue({ _id: "cat-id" });

		await expect(mutateAndGetPayload(args)).rejects.toThrow(
			"Product with this name already exists",
		);

		expect(mockedProduct.create).not.toHaveBeenCalled();
	});

	it("throws when category not found", async () => {
		const args = {
			name: "New",
			slug: "new",
			description: "desc",
			price: 10,
			images: [],
			category: "missing-cat",
		};

		mockedProduct.findOne.mockResolvedValue(null);
		mockedCategory.findById.mockResolvedValue(null);

		await expect(mutateAndGetPayload(args)).rejects.toThrow(
			"Category not found",
		);

		expect(mockedProduct.create).not.toHaveBeenCalled();
	});
});
