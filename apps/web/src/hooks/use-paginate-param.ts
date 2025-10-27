import { useQueryStates } from "nuqs";
import { parseAsInteger } from "nuqs/server";

export const paginateParamsSchema = {
	page: parseAsInteger.withDefault(1),
};

export function usePaginateParam() {
	const [pagination, setPagination] = useQueryStates(paginateParamsSchema);

	return {
		page: pagination.page,
		setPage: (page: number) => setPagination({ page }),
	};
}
