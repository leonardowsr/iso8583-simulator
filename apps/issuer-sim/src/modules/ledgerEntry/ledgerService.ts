import { LedgerEntries } from "./LedgerEntryModel";

export const ledgerService = () => {
	const ledgerEntries = LedgerEntries;

	async function checkExistingEntry(idempotencyKey: string) {
		const existingEntry = await ledgerEntries.findOne({ idempotencyKey });
		if (existingEntry) {
			return true;
		}
		return false;
	}
	return {
		checkExistingEntry,
	};
};
