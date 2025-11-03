type Brand = "visa" | "mastercard" | "unknown";

export function getCardBrand(cardNumber: string): Brand {
	const cleanedPan = cardNumber.replaceAll(" ", "");
	// VISA: começa com 4
	if (cleanedPan.startsWith("4")) return "visa";
	// MASTERCARD: começa com 51-55 ou 2221-2720
	if (cleanedPan.length === 16) {
		const first2 = Number(cleanedPan.slice(0, 2));
		const first6 = Number(cleanedPan.slice(0, 6));
		const mc_51_55 = first2 >= 51 && first2 <= 55;
		const mc_2221_2720 = first6 >= 222100 && first6 <= 272099;
		if (mc_51_55 || mc_2221_2720) return "mastercard";
	}
	return "unknown";
}
