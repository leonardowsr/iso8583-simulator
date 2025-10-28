import { useQueryStates } from "nuqs";
import { createLoader, parseAsArrayOf, parseAsString } from "nuqs/server";


export const categoryFilterParamsSchema = {
	categories: parseAsArrayOf(parseAsString).withDefault([]),
};

export function useCategoryFilterParam() {
	const [filter, setFilter] = useQueryStates(categoryFilterParamsSchema);

	return {
		categories: filter.categories,
		setCategories: (categories: string[]) => setFilter({ categories }),
		clearCategories: () => setFilter({ categories: [] }),
	};
}
