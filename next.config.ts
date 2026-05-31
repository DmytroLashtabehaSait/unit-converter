import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	basePath: "/unit-converter",
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
