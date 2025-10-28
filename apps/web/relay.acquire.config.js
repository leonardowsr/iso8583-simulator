const config = {
	src: "./src",
	artifactDirectory: "./src/__generated_acquire__",
	schema: "./data/schemaAcquirer.graphql",

	exclude: [
		"**/node_modules/**",
		"**/.next/**",
		"**/__mocks__/**",
		"**/__generated_ecommerce__/**",
		"src/app/(ecommerce)/**",
		"src/components/(ecommerce)/**",
		"src/mutations/ecommerce/**",
	],
	language: "typescript",
};

module.exports = config;
