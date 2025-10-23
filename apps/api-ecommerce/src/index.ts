import http from "node:http";
import { config } from "./config";
import { connectDatabase } from "./database";
import { app } from "./server/app";

(async () => {
	await connectDatabase();

	const server = http.createServer(app.callback());

	server.listen(config.PORT, () => {
		console.info(`GraphQL Playground: http://localhost:${config.PORT}/graphql`);
		console.info("Mongoexpress  : http://localhost:8081/mongoexpress");
	});
})();
