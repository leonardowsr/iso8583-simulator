import type mongoose from "mongoose";
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
			ledgerEntries.create(
				{
					amount: data.amount,
					type: EledgerEntryType.CASHOUT,
					accountId: data.costumerAccountId,
					idempotencyKey: data.idempotencyKey,
				},
				{ session },
			),

			ledgerEntries.create(
				{
					amount: data.amount,
					type: EledgerEntryType.CASHIN,
					accountId: data.internalAccountId,
					idempotencyKey: `${data.idempotencyKey}`,
				},
				{ session },
			),
		]);
	}
	async function checkExistingEntry(
		idempotencyKey: string,
		session: mongoose.ClientSession,
	) {
		const existingEntry = await ledgerEntries.findOne(
			{ idempotencyKey },
			{ session },
		);
		if (existingEntry) {
			throw new Error(
				"DUPLICATE-ENTRY: Ledger entry with the same idempotency key already exists",
			);
		}
	}

	return {
		checkExistingEntry,
		createLedgerEntry,
	};
};
