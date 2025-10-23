import type { GetServerSideProps } from "next";
import { graphql, type PreloadedQuery, usePreloadedQuery } from "react-relay";
import pageQuery, {
	type pages_PageQuery,
} from "../__generated__/pages_PageQuery.graphql";
import { Layout } from "../components/Layout";
import { Message } from "../components/Message";
import { MessageList } from "../components/MessageList";
import { getPreloadedQuery } from "../relay/network";

const _IndexQuery = graphql`
	query pages_PageQuery($first: Int!, $after: String) {
		messages(first: $first, after: $after) @connection(key: "pages_messages") {
			__id
			edges {
				node {
					id
					...Message_message
				}
			}
		}
	}
`;

type IndexProps = {
	queryRefs: {
		pageQueryRef: PreloadedQuery<pages_PageQuery>;
	};
};

const Index = ({ queryRefs }: IndexProps) => {
	const data = usePreloadedQuery<pages_PageQuery>(
		connections: [data.messages?.__id],
		input: {},
	});

	return (
		<Layout>
			<MessageList>
				{data.messages.edges.map(({ node }) => (
					<Message key={node.id} message={node} />
				))}
			</MessageList>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async (_context) => {
	return {
		props: {
			preloadedQueries: {
				pageQueryRef: await getPreloadedQuery(pageQuery, {
					first: 1,
					after: null,
				}),
			},
		},
	};
};

export default Index;
