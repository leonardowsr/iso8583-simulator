module.exports = {
	src: "./src",
	schema: "./data/schema.graphql",
	artifactDirectory: "./src/__generated_ecommerce__",
	language: "typescript",

	exclude: [
		"**/node_modules/**",
		"**/.next/**",
		"**/__mocks__/**",
		"**/__generated_acquire__/**",
		"src/app/(acquire)/**",
		"components/(acquire)/**",
		"src/mutations/acquire/**",
	],
};
