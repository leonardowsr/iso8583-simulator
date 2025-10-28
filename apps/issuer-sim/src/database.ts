import mongoose from "mongoose";
import { config } from "./config";
import { createDefaultAccounts } from "./seed/seed";

async function connectDatabase() {
	mongoose.connection.on("close", () =>
		console.info("Database connection closed."),
	);

	try {
		await mongoose.connect(config.MONGO_URI, {
			dbName: config.DB_NAME,
		});
		await createDefaultAccounts();
	} catch (error) {
		console.error("Failed to connect to database:", error);
		process.exit(1);
	}
}

export { connectDatabase };
