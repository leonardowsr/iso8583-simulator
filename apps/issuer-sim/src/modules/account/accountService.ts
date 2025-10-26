import type mongoose from "mongoose";
import { CustomError } from "../_error/customError";
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
			throw new CustomError(
				"NOT_FOUND",
				"Conta com os dados do cartão fornecidos não existe",
			);
		}

		if (costumerAccount.balance < data.amount) {
			throw new CustomError(
				"INSUFFICIENT_FUNDS",
				"Conta não possui saldo suficiente",
			);
		}

		if (costumerAccount.expiryDate !== data.expiryDate) {
			throw new CustomError(
				"EXPIRED_CARD",
				"Data de expiração do cartão não corresponde",
			);
		}

		if (!internalAccount) {
			throw new CustomError(
				"INTERNAL_ACCOUNT_MISSING",
				"Conta interna não encontrada",
			);
		}

		return { costumerAccount, internalAccount };
	}

	return {
		updateAccountBalance,
		validateAccount,
	};
};
