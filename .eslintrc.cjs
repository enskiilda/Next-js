module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'next/core-web-vitals',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		ecmaFeatures: {
			jsx: true
		}
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-empty-object-type': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'react-hooks/exhaustive-deps': 'off',
		'no-prototype-builtins': 'off',
		'no-control-regex': 'off',
		'no-async-promise-executor': 'off',
		'no-useless-escape': 'off',
		'prefer-const': 'off',
		'no-empty': 'off',
		'no-constant-condition': 'off',
		'import/no-anonymous-default-export': 'off',
		'no-extra-boolean-cast': 'off',
		'@next/next/no-img-element': 'off',
		'@next/next/no-css-tags': 'off'
	}
};
