"use client";
import { graphql, useFragment } from "react-relay";
import type { isoMessageItemFragment$key } from "@/__generated_acquire__/isoMessageItemFragment.graphql";

interface Props {
	isoMessage: isoMessageItemFragment$key;
}
export default function IsoMessageItem(props: Props) {
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
				relatedMessage{
					id
					rawContent
					isoResponseCode
					direction
					transactionId
					idempotencyKey
					createdAt
				}
      }
    `,
		props.isoMessage,
	);

	const isIn = String(isoMessage.direction ?? "").toLowerCase() === "in";
	const related = isoMessage.relatedMessage ?? null;

	if (related) {
		const relatedIsIn = String(related.direction ?? "").toLowerCase() === "in";
		return (
			<>
				<tr
					key={isoMessage.id}
					className="border-t-2 shadow-sm ring-slate-100 first:border-t-0 last:border-b-0 dark:border-t-white/40"
				>
					<td className="whitespace-nowrap px-3">
						<span
							className={`inline-block rounded px-2 py-0.5 font-medium text-xs ${
								isIn
									? "bg-green-100 text-green-800"
									: "bg-blue-100 text-blue-800"
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

				<tr key={related.id}>
					<td className="whitespace-nowrap px-3 py-0.5">
						<div className="flex flex-col gap-1">
							<span
								className={`inline-block rounded px-2 py-0.5 font-medium text-xs ${
									relatedIsIn
										? "bg-green-50 text-green-700"
										: "bg-blue-50 text-blue-700"
								}`}
							>
								{relatedIsIn ? "IN" : "OUT"}
							</span>
							<span className="text-[10px] text-slate-400">related</span>
						</div>
					</td>
					<td className="max-w-xs truncate px-3 py-2 text-slate-600 italic">
						{related.rawContent ?? "(no content)"}
					</td>
					<td className="px-3 py-2 text-slate-500 text-sm">
						{related.isoResponseCode ?? "-"}
					</td>
					<td className="px-3 py-2 text-slate-500 text-sm">
						{related.transactionId ?? "-"}
					</td>
					<td className="px-3 py-2 text-slate-500 text-sm">
						{related.idempotencyKey ?? "-"}
					</td>
					<td className="whitespace-nowrap px-3 py-2 text-slate-400 text-xs">
						{related.createdAt
							? new Date(related.createdAt).toLocaleString()
							: "-"}
					</td>
				</tr>

				<tr>
					<td colSpan={6} className="h-1" />
				</tr>
			</>
		);
	}

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
