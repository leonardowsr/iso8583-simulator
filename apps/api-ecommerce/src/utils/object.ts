/**
 * Removes undefined values from an object
 * Keeps null, empty strings, 0, false, etc.
 */
export const removeUndefined = <T extends Record<string, any>>(
	obj: T,
): Partial<T> => {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => value !== undefined),
	) as Partial<T>;
};

/**
 * Validates that required fields are not empty strings
 */
export const validateNotEmpty = (
	value: string | null | undefined,
	fieldName: string,
): void => {
	if (value === "") {
		throw new Error(`${fieldName} cannot be empty`);
	}
};
