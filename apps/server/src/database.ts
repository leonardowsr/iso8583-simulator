import mongoose from "mongoose";

import { config } from "./config";

async function connectDatabase() {
	mongoose.connection.on("close", () =>
		console.info("Database connection closed."),
	);

	await mongoose.connect(config.MONGO_URI);
}

export { connectDatabase };
