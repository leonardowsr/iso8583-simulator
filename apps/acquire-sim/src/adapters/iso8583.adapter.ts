import net from "node:net";
import {
	createIsoPack,
	parseIsobuffer,
	type TransactionAddInput,
} from "@fintech/shared";
import type { RedisPubSub } from "graphql-redis-subscriptions";
import type { Model } from "mongoose";
import { config } from "../config";
import { PUB_SUB_EVENTS } from "../modules/_pubSub/pubSubEvents";
import {
	Edirection,
	type IIsoMessage,
} from "../modules/isoMessage/isoMessageModel";

type transactionData = TransactionAddInput & { transactionId: string };
export interface IIso8583Client {
	sendTransaction(data: transactionData): Promise<void>;
}

export function createIssuerAdapterFactory(
	pubSub: RedisPubSub,
	isoMessageModel: Model<IIsoMessage>,
) {
	let client: net.Socket | null = null;
	let relatedOutMessageId: string | null = null;
	const host = config.ISSUER_HOST;
	const port = config.ISSUER_PORT;

	const getClient = () => {
		if (!client) throw new Error("Socket not initialized");
		return client;
	};

	const connect = async () => {
		client = new net.Socket();

		return new Promise<void>((resolve, reject) => {
			const socket = getClient();

			socket.once("error", (err) => {
				console.error("Connection error:", err);
				reject(err);
			});

			console.info("Connecting to ISO 8583 server at", `${host}:${port}`);

			socket.connect(port, host, () => {
				console.info("Connected to ISO 8583 server");
				resolve();
			});
		});
	};

	const close = async () => {
		return new Promise<void>((resolve) => {
			if (!client) return resolve();
			const socket = getClient();
			relatedOutMessageId = null;
			socket.end(() => {
				console.info("Disconnected from ISO 8583 server");
				resolve();
			});
		});
	};

	const sendTransaction = async (data: transactionData): Promise<void> => {
		try {
			await connect();
		} catch (err) {
			console.error("Error connecting to ISO 8583 server:", err);
			throw err;
		}

		const messageOut = await isoMessageModel.create({
			rawContent:
				"Sending ISO 8583 message, mti 0200 to issuer sim to authorize card",
			transactionId: data.transactionId,
			direction: Edirection.OUTGOING,
			idempotencyKey: data.idempotencyKey,
		});
		relatedOutMessageId = messageOut._id;

		pubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
			isoMessage: messageOut._id.toString(),
		});

		return new Promise((resolve, reject) => {
			const socket = getClient();

			const isoBuffer = createIsoPack(data).getBufferMessage();
			socket.write(isoBuffer, (err) => {
				if (err) {
					console.error("Error sending ISO 8583 message:", err);
					return reject(err);
				}
				console.info("ISO 8583 message sent successfully");
			});

			socket.once("data", async (response) => {
				const isoData = parseIsobuffer(response);
				const messageIn = await isoMessageModel.create({
					transactionId: data.transactionId,
					direction: Edirection.INCOMING,
					idempotencyKey: data.idempotencyKey,
					rawContent: `Response 39:${isoData["63"] || "Successful transaction"}`,
					isoResponseCode: isoData["39"] || "ER",
					relatedMessage: relatedOutMessageId,
				});

				pubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
					isoMessage: messageIn._id.toString(),
				});

				await close();

				if (isoData["39"] && isoData["39"] !== "00") {
					reject(isoData);
				} else {
					resolve(isoData);
				}
			});

			socket.setTimeout(5000);

			socket.once("timeout", async () => {
				console.error("ISO 8583 message timed out");

				const messageIn = await isoMessageModel.create({
					transactionId: data.transactionId,
					direction: Edirection.INCOMING,
					idempotencyKey: data.idempotencyKey,
					rawContent: "ISO 8583 message timed out waiting for response 5000 ms",
					isoResponseCode: "91",
					relatedMessage: relatedOutMessageId,
				});

				pubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
					isoMessage: messageIn._id.toString(),
				});

				await close();
				reject(new Error("ISO 8583 message timed out"));
			});

			socket.once("error", async (err) => {
				console.error("ISO 8583 client error:", err);

				const messageIn = await isoMessageModel.create({
					transactionId: data.transactionId,
					direction: Edirection.INCOMING,
					idempotencyKey: data.idempotencyKey,
					rawContent: `Erro de rede: ${err.message}`,
					isoResponseCode: "96",
					relatedMessage: relatedOutMessageId,
				});

				pubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
					isoMessage: messageIn._id.toString(),
				});

				await close();
				reject(err);
			});
		});
	};

	return { sendTransaction };
}
