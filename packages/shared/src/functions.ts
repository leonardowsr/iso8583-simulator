/** biome-ignore-all lint/suspicious/noExplicitAny: no need */
export const removeUndefined = (obj: Record<string, any>) => {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => value !== undefined),
	);
};
