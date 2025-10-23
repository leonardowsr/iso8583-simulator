import { createLoader } from "@entria/graphql-mongo-helpers";
import { registerLoader } from "../_loader/loaderRegister";
import { Order } from "./OrderModel";

const { getLoader, load, loadAll, Wrapper, clearCache } = createLoader({
	model: Order,
	loaderName: "OrderLoader",
});

registerLoader("OrderLoader", getLoader);

export const OrderLoader = {
	Order: Wrapper,
	load,
	clearCache,
	loadAll,
	getLoader,
};
