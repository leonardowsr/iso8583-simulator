import http from "http";
import { config } from "./config";
import { connectDatabase } from "./database";
import { schema } from "./schema/schema";
import { app } from "./server/app";
import { createGraphqlWs } from "./server/createGraphqlWs";
import { getContext } from "./server/getContext";

(async () => {
	await connectDatabase();

	const server = http.createServer(app.callback());

	createGraphqlWs(server, "/graphql/ws", {
		schema,
		context: async () => getContext(),
	});

	server.listen(config.PORT, () => {
		console.info(
			`🚀 GraphQL WS server running on ws://localhost:${config.PORT}/graphql/ws`,
		);
		console.info(
			`🎮 Console WS server running on ws://localhost:${config.PORT}/console/graphql/ws`,
		);
		console.info(`📡 Server running on port:${config.PORT}`);
	});
})();
