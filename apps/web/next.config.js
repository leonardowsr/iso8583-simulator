/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	typedRoutes: true,
	transpilePackages: ["@fintech/ui"],
	compiler: {
		// @ts-expect-error
		relay: require("./relay.config"),
	},
};

module.exports = nextConfig;
