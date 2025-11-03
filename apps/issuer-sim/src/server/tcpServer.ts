import net from "node:net";
import { createIsoErrorBuffer, parseIsoPack } from "@fintech/shared";
// @ts-expect-error
import iso_8583 from "iso_8583";
import { config } from "../config";
import { CustomError, errorEnum } from "../modules/_error/customError";
import { authorizationService } from "../modules/authorization/authorizationService";

const isoResponse = {
	0: "0210",
	39: "00",
};

export const isoTcpServer = () => {
	const authorizeTransaction = authorizationService();
	const server = net.createServer();

	server.on("connection", (socket) => {
		socket.on("data", async (data) => {
			const isoInstance = new iso_8583();
			try {
				const unpackedData = parseIsoPack(data, isoInstance);

				if ("error" in unpackedData) {
					throw new CustomError(
						"INVALID_ISO8583_DATA",
						unpackedData.error.message,
					);
				}

				await authorizeTransaction.authorizeTransaction(unpackedData);

				const isoInstanceRes = new iso_8583(isoResponse);
				const responseBuffer = isoInstanceRes.getBufferMessage();
				socket.write(responseBuffer);
			} catch (err) {
				let errorBuffer: Uint8Array;
				switch (true) {
					case err instanceof CustomError:
						errorBuffer = createIsoErrorBuffer(
							err.reason || "INVALID_ISO8583_DATA",
							err.message || "Failed to parse ISO8583 data",
						);
						break;
					case err instanceof Error:
						errorBuffer = createIsoErrorBuffer(
							errorEnum.UNKNOWN_ERROR,
							err?.message || "Algo deu errado",
						);
						break;
					default:
						errorBuffer = createIsoErrorBuffer(
							errorEnum.UNKNOWN_ERROR,
							"Algo deu errado",
						);
				}

				socket.write(errorBuffer);
			}
		});

		socket.on("error", (err) => {
			console.info("Error in socket:", err);
		});

		socket.on("close", () => {
			console.info("Connection closed");
		});
	});

	server.on("error", (err) => {
		console.error("Server error:", err);
	});
	server.listen(config.PORT, () => {
		console.info("TCP Server listening on port 5000");
	});
};
