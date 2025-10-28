import { getDataloaders } from "../modules/_loader/loaderRegister";
import type { Dataloaders, GQLContext } from "./context";

const getContext = (): GQLContext => {
	const dataloadersRuntime = getDataloaders();

	const dataloaders = dataloadersRuntime as unknown as Dataloaders;

	return {
		dataloaders,
	} as GQLContext;
};

export { getContext };
