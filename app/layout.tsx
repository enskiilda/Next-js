import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
	title: 'Open WebUI',
	description: 'Open WebUI',
	robots: 'noindex,nofollow',
	icons: {
		icon: [
			{ url: '/static/favicon.png', type: 'image/png' },
			{ url: '/static/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
			{ url: '/static/favicon.svg', type: 'image/svg+xml' }
		],
		shortcut: '/static/favicon.ico',
		apple: { url: '/static/apple-touch-icon.png', sizes: '180x180' }
	},
	manifest: '/manifest.json',
	appleWebApp: {
		title: 'Open WebUI'
	}
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	viewportFit: 'cover',
	themeColor: '#171717'
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="stylesheet" href="/static/custom.css" crossOrigin="use-credentials" />
				<script src="/static/loader.js" defer crossOrigin="use-credentials"></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								var metaThemeColorTag = document.querySelector('meta[name="theme-color"]');
								var prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

								if (!localStorage.theme) {
									localStorage.theme = 'system';
								}

								if (localStorage.theme === 'system') {
									document.documentElement.classList.add(prefersDarkTheme ? 'dark' : 'light');
									if (metaThemeColorTag) metaThemeColorTag.setAttribute('content', prefersDarkTheme ? '#171717' : '#ffffff');
								} else if (localStorage.theme === 'oled-dark') {
									document.documentElement.style.setProperty('--color-gray-800', '#101010');
									document.documentElement.style.setProperty('--color-gray-850', '#050505');
									document.documentElement.style.setProperty('--color-gray-900', '#000000');
									document.documentElement.style.setProperty('--color-gray-950', '#000000');
									document.documentElement.classList.add('dark');
									if (metaThemeColorTag) metaThemeColorTag.setAttribute('content', '#000000');
								} else if (localStorage.theme === 'light') {
									document.documentElement.classList.add('light');
									if (metaThemeColorTag) metaThemeColorTag.setAttribute('content', '#ffffff');
								} else if (localStorage.theme === 'her') {
									document.documentElement.classList.add('her');
									if (metaThemeColorTag) metaThemeColorTag.setAttribute('content', '#983724');
								} else {
									document.documentElement.classList.add('dark');
									if (metaThemeColorTag) metaThemeColorTag.setAttribute('content', '#171717');
								}

								window.matchMedia('(prefers-color-scheme: dark)').addListener(function(e) {
									if (localStorage.theme === 'system') {
										if (e.matches) {
											document.documentElement.classList.add('dark');
											document.documentElement.classList.remove('light');
											if (metaThemeColorTag) metaThemeColorTag.setAttribute('content', '#171717');
										} else {
											document.documentElement.classList.add('light');
											document.documentElement.classList.remove('dark');
											if (metaThemeColorTag) metaThemeColorTag.setAttribute('content', '#ffffff');
										}
									}
								});
							})();
						`
					}}
				/>
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
