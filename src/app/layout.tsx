'use client';

import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { useAppStore } from '@/lib/stores';
import { initI18n, getLanguages, changeLanguage } from '@/lib/i18n';
import { WEBUI_BASE_URL } from '@/lib/constants';
import { bestMatchingLanguage } from '@/lib/utils';
import { setTextScale } from '@/lib/utils/text-scale';
import AppSidebar from '@/lib/components/app/AppSidebar';
import Spinner from '@/lib/components/common/Spinner';
import dayjs from 'dayjs';
import '@/tailwind.css';
import '@/app.css';
import 'tippy.js/dist/tippy.css';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [loaded, setLoaded] = useState(false);
	const [showRefresh, setShowRefresh] = useState(false);

	const {
		config,
		setConfig,
		user,
		setUser,
		settings,
		setSettings,
		theme,
		setTheme,
		WEBUI_NAME,
		setWEBUI_NAME,
		mobile,
		setMobile,
		isLastActiveTab,
		setIsLastActiveTab,
		isApp,
		setIsApp,
		appInfo,
		setAppInfo,
		models,
		setModels
	} = useAppStore();

	const BREAKPOINT = 768;

	const mockConfig = {
		status: true,
		name: 'Open WebUI',
		version: '0.6.40',
		default_locale: 'en-US',
		default_models: '',
		default_prompt_suggestions: [
			{ content: 'Help me study', title: ['Help me study', 'vocabulary for a college entrance exam'] },
			{ content: 'Give me ideas', title: ['Give me ideas', 'for what to do with my kids art'] },
			{ content: 'Tell me a fun fact', title: ['Tell me a fun fact', 'about the Roman Empire'] },
			{ content: 'Show me a code snippet', title: ['Show me a code snippet', 'of a website sticky header'] }
		],
		features: {
			auth: false,
			auth_trusted_header: false,
			enable_api_keys: true,
			enable_signup: true,
			enable_login_form: true,
			enable_web_search: true,
			enable_google_drive_integration: false,
			enable_onedrive_integration: false,
			enable_image_generation: true,
			enable_admin_export: true,
			enable_admin_chat_access: true,
			enable_community_sharing: true,
			enable_autocomplete_generation: true,
			enable_direct_connections: true,
			enable_version_update_check: false
		},
		oauth: {
			providers: {}
		}
	};

	const mockUser = {
		id: 'local-user',
		email: 'user@localhost',
		name: 'Local User',
		role: 'admin',
		profile_image_url: '/static/favicon.png',
		permissions: {
			chat: {
				temporary_enforced: false,
				multiple_models: true
			},
			features: {
				image_generation: true,
				code_interpreter: true,
				web_search: true
			}
		}
	};

	const mockModels = [
		{
			id: 'gpt-4',
			name: 'GPT-4',
			owned_by: 'openai',
			external: true
		},
		{
			id: 'gpt-3.5-turbo',
			name: 'GPT-3.5 Turbo',
			owned_by: 'openai',
			external: true
		},
		{
			id: 'llama2',
			name: 'Llama 2',
			owned_by: 'ollama',
			details: {
				parent_model: '',
				format: 'gguf',
				family: 'llama',
				families: ['llama'],
				parameter_size: '7B',
				quantization_level: 'Q4_0'
			},
			size: 3800000000,
			description: 'Llama 2 is a collection of pretrained and fine-tuned generative text models.',
			model: 'llama2:latest',
			modified_at: '2024-01-01T00:00:00Z',
			digest: 'abc123'
		}
	];

	useEffect(() => {
		const bc = new BroadcastChannel('active-tab-channel');

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				setIsLastActiveTab(true);
				bc.postMessage('active');
			}
		};

		bc.onmessage = (event) => {
			if (event.data === 'active') {
				setIsLastActiveTab(false);
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		handleVisibilityChange();

		if (typeof window !== 'undefined') {
			if ((window as any).applyTheme) {
				(window as any).applyTheme();
			}
		}

		const initApp = async () => {
			if ((window as any)?.electronAPI) {
				const info = await (window as any).electronAPI.send({
					type: 'app:info'
				});

				if (info) {
					setIsApp(true);
					setAppInfo(info);
				}
			}

			setTheme(localStorage.theme || 'system');
			setMobile(window.innerWidth < BREAKPOINT);

			const onResize = () => {
				setMobile(window.innerWidth < BREAKPOINT);
			};
			window.addEventListener('resize', onResize);

			initI18n(localStorage?.locale);
			if (!localStorage.locale) {
				const languages = await getLanguages();
				const browserLanguages = navigator.languages
					? navigator.languages
					: [navigator.language || (navigator as any).userLanguage];
				const lang = bestMatchingLanguage(languages, browserLanguages, 'en-US');
				changeLanguage(lang);
				dayjs.locale(lang);
			}

			setConfig(mockConfig);
			setWEBUI_NAME(mockConfig.name);
			setUser(mockUser);
			setModels(mockModels);
			setSettings(JSON.parse(localStorage.getItem('settings') ?? '{}'));
			setTextScale(settings?.textScale ?? 1);

			document.getElementById('splash-screen')?.remove();
			setLoaded(true);

			return () => {
				window.removeEventListener('resize', onResize);
			};
		};

		initApp();

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<link rel="icon" type="image/png" href="/static/favicon.png" crossOrigin="use-credentials" />
				<link
					rel="icon"
					type="image/png"
					href="/static/favicon-96x96.png"
					sizes="96x96"
					crossOrigin="use-credentials"
				/>
				<link
					rel="icon"
					type="image/svg+xml"
					href="/static/favicon.svg"
					crossOrigin="use-credentials"
				/>
				<link rel="shortcut icon" href="/static/favicon.ico" crossOrigin="use-credentials" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/static/apple-touch-icon.png"
					crossOrigin="use-credentials"
				/>
				<link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
				/>
				<meta name="theme-color" content="#171717" />
				<meta name="robots" content="noindex,nofollow" />
				<script src="/static/loader.js" defer crossOrigin="use-credentials"></script>
				<link rel="stylesheet" href="/static/custom.css" crossOrigin="use-credentials" />
				<title>{WEBUI_NAME}</title>
				<link crossOrigin="anonymous" rel="icon" href={`${WEBUI_BASE_URL}/static/favicon.png`} />
				<meta name="apple-mobile-web-app-title" content={WEBUI_NAME} />
				<meta name="description" content={WEBUI_NAME} />
				<link
					rel="search"
					type="application/opensearchdescription+xml"
					title={WEBUI_NAME}
					href="/opensearch.xml"
					crossOrigin="use-credentials"
				/>
			</head>
			<body data-sveltekit-preload-data="hover">
				{showRefresh && (
					<div className="py-5">
						<Spinner className="size-5" />
					</div>
				)}

				{loaded ? (
					isApp ? (
						<div className="flex flex-row h-screen">
							<AppSidebar />
							<div className="w-full flex-1 max-w-[calc(100%-4.5rem)]">
								{children}
							</div>
						</div>
					) : (
						children
					)
				) : null}

				<Toaster
					theme={theme?.includes('dark')
						? 'dark'
						: theme === 'system'
							? window.matchMedia('(prefers-color-scheme: dark)').matches
								? 'dark'
								: 'light'
							: 'light'}
					richColors
					position="top-right"
					closeButton
				/>

				<div
					id="splash-screen"
					style={{ position: 'fixed', zIndex: 100, top: 0, left: 0, width: '100%', height: '100%' }}
				>
					<div
						style={{
							position: 'absolute',
							top: '33%',
							left: '50%',
							width: '24rem',
							transform: 'translateX(-50%)',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<img
							id="logo-her"
							style={{ width: 'auto', height: '13rem' }}
							src="/static/splash.png"
							className="animate-pulse-fast"
							alt=""
						/>

						<div style={{ position: 'relative', width: '24rem', marginTop: '0.5rem' }}>
							<div
								id="progress-background"
								style={{
									position: 'absolute',
									width: '100%',
									height: '0.75rem',
									borderRadius: '9999px',
									backgroundColor: '#fafafa9a',
								}}
							></div>

							<div
								id="progress-bar"
								style={{
									position: 'absolute',
									width: '0%',
									height: '0.75rem',
									borderRadius: '9999px',
									backgroundColor: '#fff',
								}}
								className="bg-white"
							></div>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
