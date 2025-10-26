export const errorEnum = {
	INVALID_CARD: "INVALID_CARD",
	INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
	EXPIRED_CARD: "EXPIRED_CARD",
	INTERNAL_ERROR: "INTERNAL_ERROR",
	INTERNAL_ACCOUNT_MISSING: "INTERNAL_ACCOUNT_MISSING",
	NOT_FOUND: "NOT_FOUND",
	UNKNOWN_ERROR: "UNKNOWN_ERROR",
	DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
	INVALID_ISO8583_DATA: "INVALID_ISO8583_DATA",
};

export class CustomError extends Error {
	public reason: string;

	constructor(enumKey: keyof typeof errorEnum, message: string) {
		super(message);
		this.name = "CustomError";
		this.reason = errorEnum[enumKey];
	}
}
