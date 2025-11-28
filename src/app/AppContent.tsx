'use client';

import { useEffect, useState } from 'react';
import { useAppStore, Model } from '@/lib/stores';
import { initI18n, getLanguages, changeLanguage } from '@/lib/i18n';
import { bestMatchingLanguage } from '@/lib/utils';
import AppSidebar from '@/lib/components/app/AppSidebar';
import Spinner from '@/lib/components/common/Spinner';

export default function AppContent({
	children,
}: {
	children: React.ReactNode;
}) {
	const [loaded, setLoaded] = useState(false);

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
		setIsLastActiveTab,
		setIsApp,
		setAppInfo,
		setModels
	} = useAppStore();

	const BREAKPOINT = 768;

	const mockConfig = {
		status: true,
		name: 'Open WebUI',
		version: '0.6.40',
		default_locale: 'en-US',
		default_models: '',
		default_prompt_suggestions: [],
		license_metadata: null,
		features: {
			auth: true,
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
			enable_version_update_check: true,
			code_interpreter: true,
			web_search: true
		},
		oauth: {
			providers: {}
		},
		ui: {
			pending_user_overlay_title: '',
			pending_user_overlay_description: ''
		}
	};

	const mockUser = {
		id: 'demo-user',
		email: 'demo@example.com',
		name: 'Demo User',
		role: 'user',
		profile_image_url: '',
		permissions: {}
	};

	const mockModels: Model[] = [
		{
			id: 'gpt-4',
			name: 'GPT-4',
			owned_by: 'openai' as const,
			external: true
		},
		{
			id: 'gpt-3.5-turbo',
			name: 'GPT-3.5 Turbo',
			owned_by: 'openai' as const,
			external: true
		}
	];

	useEffect(() => {
		const initApp = async () => {
			const onResize = () => {
				setMobile(window.innerWidth < BREAKPOINT);
			};
			window.addEventListener('resize', onResize);
			onResize();

			setIsApp(false);
			setIsLastActiveTab(true);

			const handleVisibilityChange = () => {
				setIsLastActiveTab(!document.hidden);
			};
			document.addEventListener('visibilitychange', handleVisibilityChange);

			const savedTheme = localStorage.getItem('theme') || 'system';
			setTheme(savedTheme);

			if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}

			initI18n(mockConfig.default_locale);
			const languages = await getLanguages();
			const browserLanguages = navigator.languages ? navigator.languages : [navigator.language];
			const lang = localStorage.getItem('locale') ?? bestMatchingLanguage(languages, browserLanguages, 'en-US');
			changeLanguage(lang);

			setConfig(mockConfig);
			setWEBUI_NAME(mockConfig.name);
			setUser(mockUser);
			setModels(mockModels);
			setSettings(JSON.parse(localStorage.getItem('settings') ?? '{}'));

			setLoaded(true);

			return () => {
				window.removeEventListener('resize', onResize);
			};
		};

		initApp();
	}, []);

	useEffect(() => {
		if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [theme]);

	if (!loaded) {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="h-screen w-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
			<AppSidebar />
			<main className="flex-1 overflow-auto">
				{children}
			</main>
		</div>
	);
}
