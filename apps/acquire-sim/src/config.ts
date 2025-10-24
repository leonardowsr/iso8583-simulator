import dotenvSafe from "dotenv-safe";
import path from "path";

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
	path: root(".env"),
	sample: root(".env.example"),
});

const ENV = process.env;

const config = {
	PORT: Number(ENV.PORT) ?? 4000,
	ISSUER_PORT: Number(ENV.ISSUER_PORT ?? 5000),
	MONGO_URI: ENV.MONGO_URI ?? "",
	REDIS_HOST: ENV.REDIS_HOST ?? "",
	ISSUER_URL: ENV.ISSUER_URL ?? "",
};

export { config };
