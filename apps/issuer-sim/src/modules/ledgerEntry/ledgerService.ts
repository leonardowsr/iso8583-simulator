import { validateZod } from "@woovi-playground/shared";
import type mongoose from "mongoose";
import { CustomError } from "../_error/customError";
import { EledgerEntryType, LedgerEntries } from "./LedgerEntryModel";

export const ledgerService = () => {
	const ledgerEntries = LedgerEntries;

	async function createLedgerEntry(
		data: {
			amount: number;
			costumerAccountId: string;
			internalAccountId: string;
			idempotencyKey: string;
		},
		session: mongoose.ClientSession,
	) {
		await Promise.all([
			ledgerEntries.create({
				amount: data.amount,
				type: EledgerEntryType.CASHOUT,
				accountId: data.costumerAccountId,
				idempotencyKey: data.idempotencyKey,
				session: session,
			}),

			ledgerEntries.create({
				amount: data.amount,
				type: EledgerEntryType.CASHIN,
				accountId: data.internalAccountId,
				idempotencyKey: `${data.idempotencyKey}`,
				session: session,
			}),
		]);
	}
	async function checkExistingEntry(
		idempotencyKey: string,
		session: mongoose.ClientSession,
	) {
		const existingEntry = await ledgerEntries
			.findOne({ idempotencyKey })
			.session(session);
		if (existingEntry) {
			throw new CustomError(
				"DUPLICATE_ENTRY",
				"Encontrado entrada para a chave de idempotencia fornecida",
			);
		}
	}

	return {
		checkExistingEntry,
		createLedgerEntry,
	};
};
