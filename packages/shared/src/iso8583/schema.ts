import * as z from "zod";

export type Iiso8583ParsedSchema = z.output<typeof iso8583Schema>;
export type Iso8583Error = z.infer<typeof iso8583ErrorSchema>;

export const iso8583Schema = z
	.object({
		0: z.string({ error: "MTI_REQ" }).length(4), // MTI
		2: z.string({ error: "PAN_REQ" }).min(1).max(19), // Primary Account Number
		3: z.string({ error: "PROCESSING_CODE_REQ" }).length(6), // Processing Code
		4: z.string({ error: "AMOUNT_REQ" }).length(12), // Amount, Transaction
		7: z.string({ error: "TRANSMISSION_DATE_TIM_REQ" }).length(10), // Transmission Date & Time
		12: z.string({ error: "TRANSACTION_TIME_REQ" }).length(6), // Time, Local Transaction
		13: z.string({ error: "TRANSACTION_DATE_REQ" }).length(4), // Date, Local Transaction
		14: z.string({ error: "EXPIRATION_DATE_REQ" }).length(4), // Date, Expiration
		55: z.string({ error: "ICC_DATA_REQ" }), // ICC Data – EMV Having multiple subfields
		63: z.string({ error: "IDEMPOTENCY_REQ" }).length(100), // Additional Data – Private
	})
	.transform((data) => {
		return {
			mti: data[0],
			cardNumber: data[2],
			processingCode: data[3],
			amount: Number(data[4]),
			transmissionDateTime: Number(data[7]),
			localTransactionTime: data[12],
			localTransactionDate: data[13],
			expirationDate: data[14],
			idempotencyKey: data[63],
			cvvData: data[55],
		};
	});

export const iso8583ErrorSchema = z.object({
	0: z.string({ error: "MTI_REQ" }).length(4), // MTI
	39: z.string({ error: "RESPONSE_CODE_REQ" }).length(2), // Response Code
	44: z.string({ error: "ERROR_DESCRIPTION_REQ" }).max(25), // Error Description
	63: z.string({ error: "ADDITIONAL_DATA_REQ" }).max(999), // Additional Data
});
