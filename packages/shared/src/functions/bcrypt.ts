import bcrypt from "bcrypt";

/**
 * Hash a string using bcrypt.
 * Returns the hashed value.
 */
export async function hashStr(str: string) {
	return await bcrypt.hash(str, 10);
}

/** Compare a string against a bcrypt hash.
 * Returns true if they match, false otherwise.
 */
export async function compareHashStr(str: string, hash: string) {
	return await bcrypt.compare(str, hash);
}
