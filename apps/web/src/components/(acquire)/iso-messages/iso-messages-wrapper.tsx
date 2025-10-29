"use client";
import { graphql, useLazyLoadQuery } from "react-relay";
import isoMessagesWrapperQuery, {
	type isoMessagesWrapperQuery as IsoMessagesWrapperQueryType,
} from "@/__generated_acquire__/isoMessagesWrapperQuery.graphql";
import { IsoMessagesList } from "@/components/(acquire)/iso-messages/iso-messages-list";

export const PageQuery = graphql`
  query isoMessagesWrapperQuery($first: Int, $after: String) {
    ...isoMessagesListFragment @arguments(first: $first, after: $after)
  }
`;
export default function IsoMessagesWrapper() {
	const queryData = useLazyLoadQuery<IsoMessagesWrapperQueryType>(
		isoMessagesWrapperQuery,
		{ first: 20 },
	);

	console.log("queryData", queryData);
	return <IsoMessagesList fragmentRef={queryData} />;
}
