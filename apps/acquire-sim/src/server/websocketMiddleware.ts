/** biome-ignore-all lint/suspicious/noExplicitAny: no effect */
import http from "node:http";

import { WebSocketServer as WSWebSocketServer } from "ws";

// work with commonjs and esm
const WebSocketServer = WSWebSocketServer;

export const createWebsocketMiddleware = (
	propertyName = "ws",
	options = {} as any,
) => {
	let serverOptions = options;
	if (options instanceof http.Server) {
		serverOptions = { server: options };
	}

	const wsServers = {};

	const getOrCreateWebsocketServer = (url: string) => {
		// @ts-expect-error
		const server = wsServers[url];

		if (server) {
			return server;
		}

		const newServer = new WebSocketServer({
			...(serverOptions.wsOptions || {}),
			noServer: true,
		});

		// @ts-expect-error
		wsServers[url] = newServer;
		// wsServers.set(url, newServer);

		return newServer;
	};

	const websocketMiddleware = async (ctx: any, next: any) => {
		const upgradeHeader = (ctx.request.headers.upgrade || "")
			.split(",")
			.map((s: any) => s.trim());

		if (~upgradeHeader.indexOf("websocket")) {
			const wss = getOrCreateWebsocketServer(ctx.url);

			ctx[propertyName] = () =>
				new Promise((resolve) => {
					wss.handleUpgrade(
						ctx.req,
						ctx.request.socket,
						Buffer.alloc(0),
						(ws: unknown) => {
							wss.emit("connection", ws, ctx.req);
							resolve(ws);
						},
					);
					ctx.respond = false;
				});
			ctx.wss = wss;
		}

		await next();
	};

	return websocketMiddleware;
};
