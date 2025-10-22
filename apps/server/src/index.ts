import http from "http";
import { config } from "./config";
import { connectDatabase } from "./database";
import { app } from "./server/app";

(async () => {
	await connectDatabase();

	const server = http.createServer(app.callback());

	server.listen(config.PORT, () => {
		console.info(`Server running on port:${config.PORT}`);
	});
})();
