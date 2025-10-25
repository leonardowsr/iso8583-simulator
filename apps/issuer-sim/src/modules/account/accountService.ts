import type mongoose from "mongoose";
import { Accounts, EAccountType } from "./AccountModel";

export const accountService = () => {
	async function updateAccountBalance(
		data: { accountId: string; amount: number },
		session: mongoose.ClientSession,
	) {
		await Promise.all([
			await Accounts.updateOne(
				{ _id: data.accountId },
				{ $inc: { balance: -data.amount } },
				{ session },
			),
			await Accounts.updateOne(
				{ accountType: EAccountType.INTERNAL },
				{ $inc: { balance: data.amount } },
				{ session },
			),
		]);
	}

	async function validateAccount(
		data: {
			cardHolderName: string;
			cardNumber: string;
			amount: number;
			expiryDate: string;
		},
		session: mongoose.ClientSession,
	) {
		const [costumerAccount, internalAccount] = await Promise.all([
			Accounts.findOne(
				{
					cardNumber: data.cardNumber,
					cardHolderName: data.cardHolderName,
				},
				{ session },
			),
			Accounts.findOne(
				{
					accountType: EAccountType.INTERNAL,
				},
				{ session },
			),
		]);

		if (!costumerAccount) {
			throw new Error(
				"NOT-FOUND:Account with provided card details does not exist",
			);
		}

		if (costumerAccount.balance < data.amount) {
			throw new Error(
				"INSUFFICIENT-FUNDS:Account does not have sufficient balance",
			);
		}

		if (costumerAccount.expiryDate !== data.expiryDate) {
			throw new Error("INVALID-EXPIRY:Account expiry date does not match");
		}

		if (!internalAccount) {
			throw new Error("INTERNAL-ACCOUNT-MISSING: Internal account not found");
		}

		return { costumerAccount, internalAccount };
	}

	return {
		updateAccountBalance,
		validateAccount,
	};
};
