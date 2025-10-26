import { createLoader } from "@entria/graphql-mongo-helpers";

import { registerLoader } from "../_loader/loaderRegister";
import { SpyMessage } from "./SpyMessageModel";

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
	model: SpyMessage,
	loaderName: "SpyMessageLoader",
});

registerLoader("SpyMessageLoader", getLoader);

export const SpyMessageLoader = {
	Message: Wrapper,
	getLoader,
	clearCache,
	load,
	loadAll,
};
