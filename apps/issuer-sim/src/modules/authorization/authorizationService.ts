import type { Iiso8583ParsedSchema } from "@woovi-playground/shared";
import { validateZod } from "@woovi-playground/shared";
import mongoose from "mongoose";
import { accountService } from "../account/accountService";
import { ledgerService } from "../ledgerEntry/ledgerService";
import { isoParsedSchema } from "./authorizationSchemas";

export function authorizationService() {
	const account = accountService();
	const ledger = ledgerService();

	async function authorizeTransaction(data: Iiso8583ParsedSchema) {
		validateZod(isoParsedSchema, data);
		const session = await mongoose.startSession();
		await session.withTransaction(async () => {
			await ledger.checkExistingEntry(data.idempotencyKey, session);
			const { costumerAccount, internalAccount } =
				await account.validateAccount(
					{
						amount: data.amount,
						cardHolderName: data.cardHolderName,
						cardNumber: data.cardNumber,
						expiryDate: data.cardExpirationDate,
					},
					session,
				);
			await ledger.createLedgerEntry(
				{
					amount: data.amount,
					costumerAccountId: costumerAccount._id,
					internalAccountId: internalAccount._id,
					idempotencyKey: data.idempotencyKey,
				},
				session,
			);
			await account.updateAccountBalance(
				{
					accountId: costumerAccount._id,
					amount: data.amount,
				},
				session,
			);
		});
	}
	return {
		authorizeTransaction,
	};
}
