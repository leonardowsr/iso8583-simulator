import mongoose from "mongoose";

import { config } from "./config";
import { createDefaultUser } from "./modules/user/seed";

async function connectDatabase() {
	mongoose.connection.on("connected", () =>
		console.info("✅ Database connected successfully"),
	);

	mongoose.connection.on("error", (err) =>
		console.error("❌ Database connection error:", err),
	);

	mongoose.connection.on("close", () =>
		console.info("Database connection closed."),
	);

	try {
		await mongoose.connect(config.MONGO_URI);
		await createDefaultUser();
	} catch (error) {
		console.error("Failed to connect to database:", error);
		process.exit(1);
	}
}

export { connectDatabase };
