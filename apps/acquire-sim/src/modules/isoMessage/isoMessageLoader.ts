import { createLoader } from "@entria/graphql-mongo-helpers";

import { registerLoader } from "../_loader/loaderRegister";
import { IsoMessage } from "./isoMessageModel";

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
	model: IsoMessage,
	loaderName: "IsoMessageLoader",
});

registerLoader("IsoMessageLoader", getLoader);

export const IsoMessageLoader = {
	Message: Wrapper,
	getLoader,
	clearCache,
	load,
	loadAll,
};
