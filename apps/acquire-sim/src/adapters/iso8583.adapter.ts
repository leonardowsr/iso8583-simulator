import net from "node:net";
import {
	createIsoPack,
	parseIsobuffer,
	type TransactionAddInput,
} from "@woovi-playground/shared";
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

// export class Iso8583Client implements IIso8583Client {
// 	private client: net.Socket | null = null;
// 	private host: string = config.ISSUER_HOST;
// 	private port: number = config.ISSUER_PORT;
// 	private pubSub: RedisPubSub;
// 	private isoMessageModel: Model<IIsoMessage>;
// 	constructor(pubSub: RedisPubSub, isoMessageModel: Model<IIsoMessage>) {
// 		this.pubSub = pubSub;
// 		this.isoMessageModel = isoMessageModel;
// 	}

// 	private getClient(): net.Socket {
// 		if (!this.client) {
// 			throw new Error("Socket not initialized");
// 		}
// 		return this.client;
// 	}

// 	private async connect(): Promise<void> {
// 		this.client = new net.Socket();

// 		return new Promise((resolve, reject) => {
// 			const client = this.getClient();

// 			client.once("error", (err) => {
// 				console.error("Connection error:", err);
// 				reject(err);
// 			});

// 			client.connect(this.port, this.host, () => {
// 				console.info("Connected to ISO 8583 server");
// 				resolve();
// 			});
// 		});
// 	}

// 	async sendTransaction(data: transactionData): Promise<void> {
// 		try {
// 			await this.connect();
// 		} catch (err) {
// 			console.error("Error connecting to ISO 8583 server:", err);
// 			throw err;
// 		}

// 		const messageOut = await this.isoMessageModel.create({
// 			rawContent:
// 				"Sending ISO 8583 message, mti 0200 to issuer sim to authorize card",
// 			transactionId: data.transactionId,
// 			direction: Edirection.OUTGOING,
// 			idempotencyKey: data.idempotencyKey,
// 		});

// 		this.pubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
// 			isoMessage: messageOut._id.toString(),
// 		});

// 		return new Promise((resolve, reject) => {
// 			const client = this.getClient();

// 			const isoBuffer = createIsoPack(data).getBufferMessage();

// 			client.write(isoBuffer, (err) => {
// 				if (err) {
// 					console.error("Error sending ISO 8583 message:", err);
// 					reject(err);
// 				} else {
// 					console.info("ISO 8583 message sent successfully");
// 				}
// 			});

// 			client.once("data", async (response) => {
// 				const isoData = parseIsobuffer(response);

// 				const messageIn = await this.isoMessageModel.create({
// 					transactionId: data.transactionId,
// 					direction: Edirection.INCOMING,
// 					idempotencyKey: data.idempotencyKey,
// 					rawContent: `Response 39:${isoData["63"] || "Successful transaction"}`,
// 					isoResponseCode: isoData["39"] || "ER",
// 				});
// 				this.pubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
// 					isoMessage: messageIn._id.toString(),
// 				});

// 				await this.close();

// 				if (isoData["39"] && isoData["39"] !== "00") {
// 					reject(isoData);
// 				} else {
// 					resolve(isoData);
// 				}
// 			});

// 			client.setTimeout(5000);

// 			client.once("timeout", async () => {
// 				console.error("ISO 8583 message timed out");

// 				const messageIn = await this.isoMessageModel.create({
// 					transactionId: data.transactionId,
// 					direction: Edirection.INCOMING,
// 					idempotencyKey: data.idempotencyKey,
// 					rawContent: "ISO 8583 message timed out waiting for response 5000 ms",
// 					isoResponseCode: "91",
// 				});
// 				this.pubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
// 					isoMessage: messageIn._id.toString(),
// 				});

// 				await this.close();
// 				reject(new Error("ISO 8583 message timed out"));
// 			});

// 			client.once("error", async (err) => {
// 				console.error("ISO 8583 client error:", err);

// 				const messageIn = await this.isoMessageModel.create({
// 					transactionId: data.transactionId,
// 					direction: Edirection.INCOMING,
// 					idempotencyKey: data.idempotencyKey,
// 					rawContent: `Erro de rede: ${err.message}`,
// 					isoResponseCode: "96",
// 				});
// 				this.pubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
// 					isoMessage: messageIn._id.toString(),
// 				});

// 				await this.close();
// 				reject(err);
// 			});
// 		});
// 	}

// 	private async close(): Promise<void> {
// 		return new Promise((resolve) => {
// 			const client = this.getClient();
// 			if (!client) {
// 				resolve();
// 				return;
// 			}
// 			client.end(() => {
// 				console.info("Disconnected from ISO 8583 server");
// 				resolve();
// 			});
// 		});
// 	}
// }
