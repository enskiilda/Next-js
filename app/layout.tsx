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

								var isDarkMode = document.documentElement.classList.contains('dark');
								var logo = document.createElement('img');
								logo.id = 'logo';
								logo.style = 'position: absolute; width: auto; height: 6rem; top: 44%; left: 50%; transform: translateX(-50%); display:block;';
								logo.src = isDarkMode ? '/static/splash-dark.png' : '/static/splash.png';

								document.addEventListener('DOMContentLoaded', function() {
									var splash = document.getElementById('splash-screen');
									if (document.documentElement.classList.contains('her')) {
										return;
									}
									if (splash) splash.prepend(logo);
								});
							})();
						`
					}}
				/>
			</head>
			<body>
				<div style={{ display: 'contents' }}>
					<Providers>{children}</Providers>
				</div>

				<div
					id="splash-screen"
					style={{
						position: 'fixed',
						zIndex: 100,
						top: 0,
						left: 0,
						width: '100%',
						height: '100%'
					}}
				>
					<style
						dangerouslySetInnerHTML={{
							__html: `
								html {
									overflow-y: scroll !important;
								}
							`
						}}
					/>

					<div
						style={{
							position: 'absolute',
							top: '33%',
							left: '50%',
							width: '24rem',
							transform: 'translateX(-50%)',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center'
						}}
					>
						<img
							id="logo-her"
							style={{ width: 'auto', height: '13rem' }}
							src="/static/splash.png"
							className="animate-pulse-fast"
							alt="Logo"
						/>

						<div style={{ position: 'relative', width: '24rem', marginTop: '0.5rem' }}>
							<div
								id="progress-background"
								style={{
									position: 'absolute',
									width: '100%',
									height: '0.75rem',
									borderRadius: '9999px',
									backgroundColor: '#fafafa9a'
								}}
							></div>

							<div
								id="progress-bar"
								style={{
									position: 'absolute',
									width: '0%',
									height: '0.75rem',
									borderRadius: '9999px',
									backgroundColor: '#fff'
								}}
								className="bg-white"
							></div>
						</div>
					</div>
				</div>

				<style
					dangerouslySetInnerHTML={{
						__html: `
							html {
								overflow-y: hidden !important;
								overscroll-behavior-y: none;
							}

							#splash-screen {
								background: #fff;
							}

							html.dark #splash-screen {
								background: #000;
							}

							html.her #splash-screen {
								background: #983724;
							}

							#logo-her {
								display: none;
							}

							#progress-background {
								display: none;
							}

							#progress-bar {
								display: none;
							}

							html.her #logo {
								display: none;
							}

							html.her #logo-her {
								display: block;
								filter: invert(1);
							}

							html.her #progress-background {
								display: block;
							}

							html.her #progress-bar {
								display: block;
							}

							@media (max-width: 24rem) {
								html.her #progress-background {
									display: none;
								}

								html.her #progress-bar {
									display: none;
								}
							}

							@keyframes pulse {
								50% {
									opacity: 0.65;
								}
							}

							.animate-pulse-fast {
								animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
							}
						`
					}}
				/>
			</body>
		</html>
	);
}
