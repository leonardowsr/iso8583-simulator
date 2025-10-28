import { createLoader } from "@entria/graphql-mongo-helpers";
import { registerLoader } from "../_loader/loaderRegister";
import { User } from "./UserModel";

const { getLoader, load, loadAll, Wrapper, clearCache } = createLoader({
	model: User,
	loaderName: "UserLoader",
});

registerLoader("UserLoader", getLoader);

export const UserLoader = {
	User: Wrapper,
	load,
	clearCache,
	loadAll,
	getLoader,
};
