/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		APP_VERSION: process.env.npm_package_version || '0.6.40',
		APP_BUILD_HASH: process.env.APP_BUILD_HASH || 'dev-build'
	},
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'$lib': './src/lib',
			'$app/environment': './src/lib/next-compat/environment.ts',
			'$app/stores': './src/lib/next-compat/stores.ts',
			'$app/navigation': './src/lib/next-compat/navigation.ts',
			'$app/state': './src/lib/next-compat/state.ts'
		};
		return config;
	},
	images: {
		unoptimized: true
	},
	output: 'export',
	trailingSlash: false
};

module.exports = nextConfig;
