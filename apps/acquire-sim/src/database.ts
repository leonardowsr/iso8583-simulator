import mongoose from "mongoose";

import { config } from "./config";

async function connectDatabase() {
	// eslint-disable-next-line
	mongoose.connection.on("close", () =>
		console.log("Database connection closed."),
	);

	try {
		await mongoose.connect(config.MONGO_URI);
	} catch (error) {
		console.error("Failed to connect to database:", error);
		process.exit(1);
	}
}

export { connectDatabase };
