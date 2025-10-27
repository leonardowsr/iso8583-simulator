import fs from "node:fs/promises";
import path from "node:path";
import { printSchema } from "graphql/utilities";

import { schema } from "../src/schema/schema";

(async () => {
	await fs.writeFile(
		path.join(__dirname, "../schema/schema.graphql"),
		printSchema(schema),
	);

	process.exit(0);
})();
