'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Toaster } from 'sonner';

interface AppState {
	config: any;
	user: any;
	settings: any;
	theme: string;
	webuiName: string;
	mobile: boolean;
	isLastActiveTab: boolean;
	isApp: boolean;
	appInfo: any;
	models: any[];
	loaded: boolean;
}

const initialState: AppState = {
	config: null,
	user: null,
	settings: {},
	theme: 'system',
	webuiName: 'Open WebUI',
	mobile: false,
	isLastActiveTab: true,
	isApp: false,
	appInfo: null,
	models: [],
	loaded: false
};

const AppContext = createContext<{
	state: AppState;
	setState: React.Dispatch<React.SetStateAction<AppState>>;
}>({
	state: initialState,
	setState: () => {}
});

export const useAppContext = () => useContext(AppContext);

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

export function Providers({ children }: { children: ReactNode }) {
	const [state, setState] = useState<AppState>(initialState);

	useEffect(() => {
		const BREAKPOINT = 768;
		
		const handleResize = () => {
			setState(prev => ({
				...prev,
				mobile: window.innerWidth < BREAKPOINT
			}));
		};

		const bc = new BroadcastChannel('active-tab-channel');
		bc.onmessage = (event) => {
			if (event.data === 'active') {
				setState(prev => ({ ...prev, isLastActiveTab: false }));
			}
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				setState(prev => ({ ...prev, isLastActiveTab: true }));
				bc.postMessage('active');
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		handleVisibilityChange();

		setState(prev => ({
			...prev,
			theme: localStorage.theme || 'system',
			mobile: window.innerWidth < BREAKPOINT,
			config: mockConfig,
			webuiName: mockConfig.name,
			user: mockUser,
			models: mockModels,
			settings: JSON.parse(localStorage.getItem('settings') ?? '{}'),
			loaded: true
		}));

		window.addEventListener('resize', handleResize);

		const splashScreen = document.getElementById('splash-screen');
		if (splashScreen) {
			splashScreen.remove();
		}

		return () => {
			window.removeEventListener('resize', handleResize);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			bc.close();
		};
	}, []);

	const getThemeForToaster = () => {
		if (state.theme.includes('dark')) return 'dark';
		if (state.theme === 'system') {
			if (typeof window !== 'undefined') {
				return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			}
		}
		return 'light';
	};

	return (
		<AppContext.Provider value={{ state, setState }}>
			{state.loaded ? children : null}
			<Toaster
				theme={getThemeForToaster()}
				richColors
				position="top-right"
				closeButton
			/>
		</AppContext.Provider>
	);
}
