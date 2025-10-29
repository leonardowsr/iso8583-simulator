"use client";
import React from "react";
import { graphql, useFragment } from "react-relay";
import type { isoMessagesListFragment$key } from "@/__generated_ecommerce__/isoMessagesListFragment.graphql";

interface Props {
	isoMessage: isoMessagesListFragment$key;
}
export default function IsoMessageItem(Props: Props) {
	const isoMessage = useFragment(
		graphql`
      fragment isoMessageItemFragment on IsoMessage {
        id
        rawContent
        isoResponseCode
        direction
        transactionId
        idempotencyKey
        createdAt
      }
    `,
		Props.isoMessage,
	);
	const isIn = String(isoMessage.direction ?? "").toLowerCase() === "in";

	return (
		<tr key={isoMessage.id} className="border-b last:border-b-0">
			<td className="whitespace-nowrap px-3 py-2">
				<span
					className={`inline-block rounded px-2 py-0.5 font-medium text-xs ${
						isIn ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
					}`}
				>
					{isIn ? "IN" : "OUT"}
				</span>
			</td>
			<td className="max-w-xs truncate px-3 py-2">
				{isoMessage.rawContent ?? "(no content)"}
			</td>
			<td className="px-3 py-2 text-slate-600 text-sm">
				{isoMessage.isoResponseCode ?? "-"}
			</td>
			<td className="px-3 py-2 text-slate-600 text-sm">
				{isoMessage.transactionId ?? "-"}
			</td>
			<td className="px-3 py-2 text-slate-600 text-sm">
				{isoMessage.idempotencyKey ?? "-"}
			</td>
			<td className="whitespace-nowrap px-3 py-2 text-slate-400 text-xs">
				{isoMessage.createdAt
					? new Date(isoMessage.createdAt).toLocaleString()
					: "-"}
			</td>
		</tr>
	);
}
