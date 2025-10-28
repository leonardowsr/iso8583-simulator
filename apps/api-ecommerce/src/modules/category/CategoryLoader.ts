import { createLoader } from "@entria/graphql-mongo-helpers";
import { registerLoader } from "../_loader/loaderRegister";
import { Category } from "./CategoryModel";

const { getLoader, load, loadAll, Wrapper, clearCache } = createLoader({
	model: Category,
	loaderName: "CategoryLoader",
});

registerLoader("CategoryLoader", getLoader);

export const CategoryLoader = {
	Category: Wrapper,
	load,
	clearCache,
	loadAll,
	getLoader,
};
