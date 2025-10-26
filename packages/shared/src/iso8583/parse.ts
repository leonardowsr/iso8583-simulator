// @ts-expect-error
import iso_8583 from "iso_8583";
import { iso8583Schema } from "./schema";

export function parseIsoPack(
	buffer: Buffer,
	isoInstance = new iso_8583() as iso_8583,
) {
	const isoData = isoInstance.getIsoJSON(buffer);

	const validation = iso8583Schema.safeParse(isoData);

	if (!validation.success) {
		const flattened = validation.error.flatten();
		const fieldErrors = Object.entries(flattened.fieldErrors)
			.map(([field, messages]) => `Field ${field}: ${messages.join(", ")}`)
			.join(". ");
		const formErrors = flattened.formErrors.join(", ");
		const message = [fieldErrors, formErrors].filter(Boolean).join(". ");

		return {
			error: {
				message: message || "Invalid ISO8583 data",
			},
		};
	}

	return validation.data;
}

export function parseIsobuffer(buffer: Buffer) {
	const isoInstance = new iso_8583();
	return isoInstance.getIsoJSON(buffer);
}
