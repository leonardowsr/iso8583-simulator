import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const moneyToCents = (value: string) => {
	if (!value) return 0;

	// Remove tudo que não for número, vírgula ou ponto
	let cleaned = value.replace(/[^\d,]/g, "");

	// Se tem vírgula, os dígitos depois já são centavos
	if (cleaned.includes(",")) {
		// caso depois da virgula só tenha 1 digito, adiciona um zero no final
		if (cleaned.split(",")[1].length === 1) {
			cleaned += "0";
		}
		const [reais, centavos = "00"] = cleaned.split(",");
		// Garante que centavos tem 2 dígitos
		const centavosPadded = `${centavos}00`.slice(0, 2);
		return Number.parseInt(reais + centavosPadded, 10);
	}

	// Se não tem vírgula, multiplica por 100 (são reais inteiros)
	return Number.parseInt(cleaned, 10) * 100;
};

export const moneyToString = (valueInCents: number | null | undefined) => {
	let value = valueInCents;
	if (!value) value = 0;
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value / 100);
};
