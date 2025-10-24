/** biome-ignore-all lint/suspicious/noExplicitAny: change any after */
// @ts-expect-error
import iso8583 from "iso_8583";
import net from "net";
import { config } from "../config";

export interface IIso8583Client {
	connect(): Promise<void>;
	send(): Promise<void>;
	sendTransaction(data: any): Promise<void>;
	close(): Promise<void>;
}

export class Iso8583Client implements IIso8583Client {
	private client: net.Socket;
	private host: string = config.ISSUER_URL;
	private port: number = config.ISSUER_PORT;
	constructor() {
		this.client = new net.Socket();
	}

	async connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.once("connect", () => {
				console.info(
					`Connected to ISO 8583 server at ${this.host}:${this.port}`,
				);
				resolve();
			});

			this.client.once("error", (err) => {
				console.error("Connection error:", err);
				reject(err);
			});

			this.client.connect(config.ISSUER_PORT, config.ISSUER_URL, () => {
				console.info("Connected to ISO 8583 server");
				resolve();
			});
		});
	}

	async sendTransaction(data: any): Promise<void> {
		return new Promise((resolve, reject) => {
			const teste = new iso8583(isoData, customFormats);

			const messageBuffer = teste.getRawMessage();
			console.log("ISO 8583 Message Buffer:", messageBuffer);
			resolve();
		});
	}
	async send(): Promise<void> {
		return new Promise((resolve, reject) => {
			// Implement your send logic here
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

const customFormats = {
	"3": {
		ContentType: "n",
		Label: "Processing code",
		LenType: "fixed",
		MaxLen: 9,
	},
};
const isoData = {
	0: "0100",
	2: "4761739001010119",
	3: "000000",
	4: "000000005000",
	7: "0911131411",
	12: "131411",
	13: "0911",
	14: "2212",
	18: "4111",
	22: "051",
	23: "001",
	25: "00",
	26: "12",
	32: "423935",
	33: "111111111",
	35: "4761739001010119D22122011758928889",
	41: "12345678",
	42: "MOTITILL_000001",
	43: "My Termianl Business                    ",
	49: "404",
	52: "7434F67813BAE545",
	56: "1510",
	123: "91010151134C101",
	127: "000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959",
};
