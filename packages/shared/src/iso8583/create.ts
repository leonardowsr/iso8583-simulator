// @ts-expect-error
import iso_8583 from "iso_8583";
export type TransactionAddInput = {
	userId: string;
	orderRef: string;
	amount: number;
	idempotencyKey: string;
	cardNumber: string;
	cardHolderName: string;
	cardExpiryMonth: string;
	cardExpiryYear: string;
	cardCvv: string;
};

export const createIsoPack = (args: TransactionAddInput): iso_8583 => {
	const amount = args.amount.toString().padStart(12, "0");
	const now = new Date();
	const MM = String(now.getMonth() + 1).padStart(2, "0");
	const DD = String(now.getDate()).padStart(2, "0");
	const hh = String(now.getHours()).padStart(2, "0");
	const mm = String(now.getMinutes()).padStart(2, "0");
	const ss = String(now.getSeconds()).padStart(2, "0");

	const isoData = {
		0: "0200",
		2: args.cardNumber,
		3: "000000",
		4: amount,
		7: `${MM}${DD}${hh}${mm}${ss}`,
		11: Math.floor(100000 + Math.random() * 899999).toString(), // STAN
		12: hh + mm + ss,
		13: MM + DD,
		14: `${args.cardExpiryMonth}${args.cardExpiryYear}`,
		18: "4111",
		22: "051",
		25: "00",
		41: "ACQTERM1",
		42: "INDBANK00012345",
		48: args.cardHolderName,
		49: "986",
		55: args.cardCvv, // só para simulação
		63: args.idempotencyKey, // correlacionar
	};
	return new iso_8583(isoData);
};

export const createIsoErrorBuffer = (
	reason: string,
	message: string,
): Uint8Array => {
	const isoData = {
		0: "0210",
		39: "ER",
		44: reason,
		63: message,
	};
	const buffer = new iso_8583(isoData).getBufferMessage();

	return buffer;
};
