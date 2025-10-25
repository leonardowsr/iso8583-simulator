/** biome-ignore-all lint/suspicious/noExplicitAny: change any after */

import {
	createIsoPack,
	parseIsobuffer,
	type TransactionAddInput,
} from "@woovi-playground/shared";
import net from "net";
import { config } from "../config";

export interface IIso8583Client {
	connect(): Promise<void>;
	sendTransaction(data: any): Promise<void>;
	close(): Promise<void>;
}

export class Iso8583Client implements IIso8583Client {
	private client: net.Socket;
	private host: string = config.ISSUER_HOST;
	private port: number = config.ISSUER_PORT;
	constructor() {
		this.client = new net.Socket();
	}

	async connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.once("error", (err) => {
				console.error("Connection error:", err);
				reject(err);
			});

			this.client.connect(this.port, this.host, () => {
				console.info("Connected to ISO 8583 server");
				resolve();
			});
		});
	}

	async sendTransaction(data: TransactionAddInput): Promise<void> {
		return new Promise((resolve, reject) => {
			const isoBuffer = createIsoPack(data).getBufferMessage();
			this.client.write(isoBuffer, (err) => {
				if (err) {
					console.error("Error sending ISO 8583 message:", err);
					reject(err);
				} else {
					console.info("ISO 8583 message sent successfully");
				}
			});

			this.client.once("data", (response) => {
				const isoData = parseIsobuffer(response);
				if ("39" in isoData && isoData["39"] === "ER") {
					reject(isoData);
				}
				resolve(isoData);
			});
		});
	}

	async close(): Promise<void> {
		return new Promise((resolve) => {
			this.client.end(() => {
				console.info("Disconnected from ISO 8583 server");
				resolve();
			});
		});
	}
}
