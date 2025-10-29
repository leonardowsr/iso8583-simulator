import { useMemo } from "react";
import { graphql, useSubscription } from "react-relay";
import type { GraphQLSubscriptionConfig } from "relay-runtime";
import type {
	useIsoMessageAddedSubscription as SubType,
	useIsoMessageAddedSubscription$variables,
} from "@/__generated_acquire__/useIsoMessageAddedSubscription.graphql";

const IsoMessageAdded = graphql`
  subscription useIsoMessageAddedSubscription(
    $input: IsoMessageAddedInput!
    $connections: [ID!]!
  ) {
    IsoMessageAdded(input: $input) {
      isoMessage
        @appendNode(
          connections: $connections
          edgeTypeName: "IsoMessageEdge"
        ) {
        id
        rawContent
        isoResponseCode
        direction
        transactionId
        idempotencyKey
        createdAt
      }
    }
  }
`;

export default function useIsoMessageAddedSubscription(
	variables: useIsoMessageAddedSubscription$variables,
) {
	const config = useMemo<GraphQLSubscriptionConfig<SubType>>(
		() => ({
			subscription: IsoMessageAdded,
			variables,
		}),
		[variables],
	);

	return useSubscription(config);
}
