import path from "node:path";
import dotenvSafe from "dotenv-safe";

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
	path: root(".env"),
	sample: root(".env.example"),
	allowEmptyValues: true,
});

const ENV = process.env;

const config = {
	PORT: Number(ENV.PORT) ?? 4000,
	ISSUER_PORT: Number(ENV.ISSUER_PORT ?? 5000),
	ISSUER_HOST: ENV.ISSUER_HOST ?? "localhost",
	MONGO_URI: ENV.MONGO_URI ?? "",
	REDIS_HOST: ENV.REDIS_HOST ?? "",
	DB_NAME: ENV.MONGO_DB_NAME ?? "acquire-sim",
};

export { config };
