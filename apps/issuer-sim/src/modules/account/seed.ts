import { Accounts, EAccountType } from "./AccountModel";

const createDefaultAccounts = async () => {
	const [existingUserAccount, existingInternalAccount] = await Promise.all([
		Accounts.findOne({ cardNumber: "5148399332202116" }),
		Accounts.findOne({ accountType: EAccountType.INTERNAL }),
	]);

	if (!existingUserAccount) {
		const account = new Accounts({
			cardHolderName: "Admin",
			cardNumber: "5148399332202116",
			expiryDate: "1230",
			cardCvv: "908",
		});
		await account.save();
	}
	if (!existingInternalAccount) {
		const internalAccount = new Accounts({
			accountType: EAccountType.INTERNAL,
			cardHolderName: "Admin",
			cardNumber: "0000000000000000",
			expiryDate: "0000",
			balance: 100000000, // 1 million
		});
		await internalAccount.save();
	}
};

export { createDefaultAccounts };
