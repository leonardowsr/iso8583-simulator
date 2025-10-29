"use client";
import { graphql, useLazyLoadQuery } from "react-relay";
import isoMessagesWrapperQuery, {
	type isoMessagesWrapperQuery as IsoMessagesWrapperQueryType,
} from "@/__generated_acquire__/isoMessagesWrapperQuery.graphql";
import { IsoMessagesList } from "@/components/(acquire)/iso-messages/iso-messages-list";

export const PageQuery = graphql`
  query isoMessagesWrapperQuery($first: Int, $after: String, $direction: String) {
    ...isoMessagesListFragment @arguments(first: $first, after: $after, direction: $direction)
  }
`;
export default function IsoMessagesWrapper() {
	const queryData = useLazyLoadQuery<IsoMessagesWrapperQueryType>(
		isoMessagesWrapperQuery,
		{ direction: "in" },
	);

	return <IsoMessagesList fragmentRef={queryData} />;
}
