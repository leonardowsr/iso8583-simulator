import { createLoader } from "@entria/graphql-mongo-helpers";
import { registerLoader } from "../_loader/loaderRegister";
import { Transaction } from "./TransationModel";

const { load, loadAll, getLoader, Wrapper, clearCache } = createLoader({
	loaderName: "TransactionLoader",
	model: Transaction,
});

registerLoader("TransactionLoader", getLoader);

export const TransactionLoader = {
	Transaction: Wrapper,
	load,
	loadAll,
	getLoader,
	clearCache,
};
