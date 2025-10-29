"use client";
import React, { useMemo } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import type { isoMessageItemFragment$key } from "@/__generated_ecommerce__/isoMessageItemFragment.graphql";
import type { isoMessagesListFragment$key } from "@/__generated_ecommerce__/isoMessagesListFragment.graphql";
import IsoMessageItem from "./iso-message-item";
import useIsoMessageAddedSubscription from "./use-iso-message-added-subscription";

const isoMessagesFragment = graphql`
  fragment isoMessagesListFragment on Query
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 20 }
    after: { type: "String" }
  )
  @refetchable(queryName: "IsoMessagesPaginationQuery") {
    isoMessages(first: $first, after: $after)
      @connection(key: "pages_isoMessages") {
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
	const { data } = usePaginationFragment(isoMessagesFragment, fragmentRef);
	useIsoMessageAddedSubscription({
		connections: [data.isoMessages?.__id ?? ""],
		input: { clientSubscriptionId: "client-1" },
	});

	return (
		<div className="flex flex-col gap-6 p-4">
			<h2 className="font-semibold text-slate-800 text-xl">
				📡 ISO8583 Messages Monitor
			</h2>
			<div>
				<p>Filtros por type</p>
				<select>
					<option value="all">Todos</option>
					<option value="incoming">Entrantes</option>
					<option value="outgoing">Salientes</option>
				</select>
			</div>
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
						{data.isoMessages?.edges.map(({ node }) => {
							return <IsoMessageItem key={node.id} isoMessage={node} />;
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
