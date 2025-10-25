import { Accounts } from "./AccountModel";

export const accountService = () => {
	async function validateAccount(
		holderName: string,
		cardNumber: number,
		amount: number,
	): Promise<boolean> {
		const account = await Accounts.findOne({
			cardNumber: cardNumber,
			cardHolderName: holderName,
		});
		if (!account) {
			throw new Error(
				"NOT-FOUND: Account with provided card details does not exist",
			);
		}

		if (account.balance < amount) {
			throw new Error(
				"INSUFFICIENT-FUNDS: Account does not have sufficient balance",
			);
		}
		return true;
	}

	return {
		validateAccount,
	};
};
