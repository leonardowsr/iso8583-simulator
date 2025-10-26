import { connectDatabase } from "./database";
import { isoTcpServer } from "./server/tcpServer";

(async () => {
	await connectDatabase();

	isoTcpServer();
})();
