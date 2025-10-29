import path from "node:path";
import dotenvSafe from "dotenv-safe";

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
	path: root(".env"),
	allowEmptyValues: true,
	debug: true,
	example: root(".env.example"),
});

const ENV = process.env;

const config = {
	PORT: Number(ENV.PORT) ?? 5000,
	MONGO_URI: ENV.MONGO_URI ?? "",
	DB_NAME: ENV.MONGO_DB_NAME ?? "issuer-sim",
};

export { config };
