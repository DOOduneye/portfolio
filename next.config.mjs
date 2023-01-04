/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	images: {
		domains: ["res.craft.do"],
		unoptimized: true,
	},
	webpack: (config) => {
		config.resolve.fallback = { fs: false, module: false, path: false };
		return config;
	},
};

export default nextConfig;
