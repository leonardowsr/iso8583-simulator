"use client";
import { graphql, usePaginationFragment } from "react-relay";
import type { isoMessageItemFragment$key } from "@/__generated_ecommerce__/isoMessageItemFragment.graphql";
import type { isoMessagesListFragment$key } from "@/__generated_ecommerce__/isoMessagesListFragment.graphql";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import IsoMessageItem from "./iso-message-item";
import useIsoMessageAddedSubscription from "./use-iso-message-added-subscription";

const isoMessagesFragment = graphql`
  fragment isoMessagesListFragment on Query
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 20 }
    after: { type: "String" }
		direction: { type: "String", defaultValue: "in" }
  )
  @refetchable(queryName: "IsoMessagesPaginationQuery") {
    isoMessages(first: $first, after: $after, direction: $direction)
      @connection(key: "pages_isoMessages", filters: ["direction"]) {
      __id
			edges {
				node {
					id
					idempotencyKey
					...isoMessageItemFragment

				}
			}
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export function IsoMessagesList({
	fragmentRef,
}: {
	fragmentRef: isoMessagesListFragment$key;
}) {
	const { data, loadNext, isLoadingNext, hasNext } = usePaginationFragment(
		isoMessagesFragment,
		fragmentRef,
	);
	useIsoMessageAddedSubscription({
		connections: [data.isoMessages?.__id ?? ""],
		input: { clientSubscriptionId: "client-1" },
	});
	return (
		<div className="m-auto flex max-w-6/7 flex-col gap-6 p-4">
			<h2 className="font-semibold text-slate-800 text-xl">
				📡 ISO8583 Messages Monitor
			</h2>

			<div className="max-h-[600px] overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
				<table className="w-full min-w-[900px] divide-y divide-slate-100 text-sm">
					<thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
						<tr>
							<th className="px-3 py-2">Dir</th>
							<th className="px-3 py-2">Raw</th>
							<th className="px-3 py-2">Resp</th>
							<th className="px-3 py-2">Txn</th>
							<th className="px-3 py-2">Idem</th>
							<th className="px-3 py-2">When</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-50 bg-white">
						{data.isoMessages?.edges.map(({ node }, idx) => {
							if (!node) return null;
							return (
								<IsoMessageItem
									key={idx}
									isoMessage={node as unknown as isoMessageItemFragment$key}
								/>
							);
						})}
					</tbody>
				</table>
				{isLoadingNext && (
					<div className="flex justify-center py-8 text-slate-500 text-sm">
						<Spinner className="size-8 text-primary" />
					</div>
				)}
			</div>
			<div className="flex justify-center">
				<Button
					onClick={() => loadNext(20)}
					disabled={isLoadingNext || !hasNext}
				>
					Load More
				</Button>
			</div>
		</div>
	);
}
