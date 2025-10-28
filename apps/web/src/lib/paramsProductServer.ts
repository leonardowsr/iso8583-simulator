import {
	createLoader,
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
} from "nuqs/server";

export const loadCategoriasParams = createLoader({
	categories: parseAsArrayOf(parseAsString).withDefault([]),
	page: parseAsString.withDefault("1"),
	minPrice: parseAsInteger.withDefault(0),
	maxPrice: parseAsInteger.withDefault(10000),
	endCursor: parseAsString.withDefault(""),
	startCursor: parseAsString.withDefault(""),
});
