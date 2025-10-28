import type { ZodSchema } from "zod";

export class ValidationError extends Error {
	public details?: unknown;
	constructor(message: string, details?: unknown) {
		super(message);
		this.name = "ValidationError";
		this.details = details;
	}
}

/**
 * Validate input against a zod schema. Throws ValidationError with joined messages when invalid.
 * Returns the parsed value when valid.
 */
export function validateZod<T>(schema: ZodSchema<T>, input: unknown): T {
	const parsed = schema.safeParse(input);
	if (parsed.success) return parsed.data;

	const { formErrors, fieldErrors } = parsed.error.flatten();
	const messages = [...formErrors, ...Object.values(fieldErrors).flat()]
		.filter(Boolean)
		.join(", ");

	throw new ValidationError(messages || "Invalid input", {
		fieldErrors,
		formErrors,
	});
}
