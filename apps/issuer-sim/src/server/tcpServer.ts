import { createIsoErrorBuffer, parseIsoPack } from "@woovi-playground/shared";
// @ts-expect-error
import iso_8583 from "iso_8583";
import net from "net";
import { config } from "../config";

export const isoTcpServer = () => {
	const server = net.createServer();
	const isoInstance = new iso_8583();

	server.on("connection", (socket) => {
		socket.on("data", async (data) => {
			try {
				const unpackedData = parseIsoPack(data, isoInstance);

				if ("error" in unpackedData) {
					const error = new Error();
					error.name = `${unpackedData.error.code}:${unpackedData.error.message}`;
					throw error;
				}
			} catch (err) {
				let errorBuffer: Uint8Array;
				if (err instanceof Error) {
					const [errorReason, errorMessage] = (err.message || "")
						.split(":")
						.map((s) => s.trim());
					errorBuffer = createIsoErrorBuffer(
						errorReason || "INVALID_ISO8583_DATA",
						errorMessage || "Failed to parse ISO8583 data",
					);
				} else {
					errorBuffer = createIsoErrorBuffer(
						"UNKNOWN_ERROR",
						"Functionality not implemented",
					);
				}

				socket.write(errorBuffer);
			}
		});

		socket.on("error", (err) => {
			console.log("nao caiu aqui");
			console.info("Socket message:", err.message);
			console.info("Socket reason:", err.name);
		});

		socket.on("close", () => {});
	});

	server.on("error", (err) => {
		console.error("Server error:", err);
	});
	server.listen(config.PORT, () => {
		console.info("TCP Server listening on port 5000");
	});
};
