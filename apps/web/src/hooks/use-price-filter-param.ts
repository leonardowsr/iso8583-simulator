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

	// Allow callers to pass nuqs options (e.g. { limitUrlUpdates: debounce(300) })
	return {
		minPrice: filter.minPrice,
		maxPrice: filter.maxPrice,
		setMinPrice: (
			min: number | undefined,
			options?: Parameters<typeof setFilter>[1],
		) => setFilter({ minPrice: min }, options),
		setMaxPrice: (
			max: number | undefined,
			options?: Parameters<typeof setFilter>[1],
		) => setFilter({ maxPrice: max }, options),
		clearPrice: (options?: Parameters<typeof setFilter>[1]) =>
			setFilter({ minPrice: 0, maxPrice: 10000 }, options),
	};
}
