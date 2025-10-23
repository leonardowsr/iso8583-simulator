import { getDataloaders } from "../modules/_loader/loaderRegister";

const getContext = () => {
	const dataloaders = getDataloaders();

	return {
		dataloaders,
	} as const;
};

export { getContext };
