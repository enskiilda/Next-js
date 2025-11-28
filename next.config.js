/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	trailingSlash: true,
	images: {
		unoptimized: true
	},
	env: {
		APP_VERSION: process.env.npm_package_version,
		APP_BUILD_HASH: process.env.APP_BUILD_HASH || 'dev-build'
	},
	webpack: (config, { isServer }) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@': './src',
			'$lib': './src/lib'
		};
		return config;
	}
};

module.exports = nextConfig;
