import { hashStr } from "@fintech/shared";
import { Accounts, EAccountType } from "../modules/account/AccountModel";

const createDefaultAccounts = async () => {
	const [existingUserAccount, existingInternalAccount] = await Promise.all([
		Accounts.findOne({ cardNumber: "5148399332202116" }),
		Accounts.findOne({ accountType: EAccountType.INTERNAL }),
	]);

	const hashedCardNumber = await hashStr("5148399332202116");
	const hashedCvv = await hashStr("908");
	const hashedInternalCardNumber = await hashStr("0000000000000000");
	if (!existingUserAccount) {
		const account = new Accounts({
			cardHolderName: "Admin",
			cardNumber: hashedCardNumber,
			expiryDate: "1230",
			cardCvv: hashedCvv,
		});
		await account.save();
	}
	if (!existingInternalAccount) {
		const internalAccount = new Accounts({
			accountType: EAccountType.INTERNAL,
			cardHolderName: "Admin",
			cardNumber: hashedInternalCardNumber,
			expiryDate: "0000",
			balance: 100000000, // 1 million
		});
		await internalAccount.save();
	}
};

export { createDefaultAccounts };
