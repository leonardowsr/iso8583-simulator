import { createLoader } from "@entria/graphql-mongo-helpers";
import { registerLoader } from "../_loader/loaderRegister";
import { Product } from "./ProductModel";

const { getLoader, load, loadAll, Wrapper, clearCache } = createLoader({
	model: Product,
	loaderName: "ProductLoader",
});

registerLoader("ProductLoader", getLoader);

export const ProductLoader = {
	Product: Wrapper,
	load,
	clearCache,
	loadAll,
	getLoader,
};
