import { useQueryStates } from "nuqs";
import { parseAsInteger } from "nuqs/server";

export const priceFilterParamsSchema = {
	minPrice: parseAsInteger.withDefault(undefined),
	maxPrice: parseAsInteger.withDefault(10000),
};

export function usePriceFilterParam() {
	const [filter, setFilter] = useQueryStates(priceFilterParamsSchema, {
		clearOnDefault: true,
	});

	return {
		minPrice: filter.minPrice,
		maxPrice: filter.maxPrice,
		setMinPrice: (min: number | undefined) => setFilter({ minPrice: min }),
		setMaxPrice: (max: number | undefined) => setFilter({ maxPrice: max }),
		clearPrice: () => setFilter({ minPrice: 0, maxPrice: 10000 }),
	};
}
