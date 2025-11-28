<script>
	import { spring } from 'svelte/motion';
	import { Toaster, toast } from 'svelte-sonner';

	let loadingProgress = spring(0, {
		stiffness: 0.05
	});

	import { onMount, tick, setContext } from 'svelte';
	import {
		config,
		user,
		settings,
		theme,
		WEBUI_NAME,
		mobile,
		isLastActiveTab,
		isApp,
		appInfo,
		models
	} from '$lib/stores';
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/state';

	import i18n, { initI18n, getLanguages, changeLanguage } from '$lib/i18n';

	import '../tailwind.css';
	import '../app.css';
	import 'tippy.js/dist/tippy.css';

	import { WEBUI_BASE_URL } from '$lib/constants';
	import { bestMatchingLanguage } from '$lib/utils';
	import { setTextScale } from '$lib/utils/text-scale';

	import AppSidebar from '$lib/components/app/AppSidebar.svelte';
	import Spinner from '$lib/components/common/Spinner.svelte';
	import dayjs from 'dayjs';

	const unregisterServiceWorkers = async () => {
		if ('serviceWorker' in navigator) {
			try {
				const registrations = await navigator.serviceWorker.getRegistrations();
				await Promise.all(registrations.map((r) => r.unregister()));
				return true;
			} catch (error) {
				console.error('Error unregistering service workers:', error);
				return false;
			}
		}
		return false;
	};

	beforeNavigate(async ({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) {
			await unregisterServiceWorkers();
			location.href = to.url.href;
		}
	});

	setContext('i18n', i18n);

	const bc = new BroadcastChannel('active-tab-channel');

	let loaded = false;

	let showRefresh = false;

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

	onMount(async () => {
		let touchstartY = 0;

		function isNavOrDescendant(el) {
			const nav = document.querySelector('nav');
			return nav && (el === nav || nav.contains(el));
		}

		document.addEventListener('touchstart', (e) => {
			if (!isNavOrDescendant(e.target)) return;
			touchstartY = e.touches[0].clientY;
		});

		document.addEventListener('touchmove', (e) => {
			if (!isNavOrDescendant(e.target)) return;
			const touchY = e.touches[0].clientY;
			const touchDiff = touchY - touchstartY;
			if (touchDiff > 50 && window.scrollY === 0) {
				showRefresh = true;
				e.preventDefault();
			}
		});

		document.addEventListener('touchend', (e) => {
			if (!isNavOrDescendant(e.target)) return;
			if (showRefresh) {
				showRefresh = false;
				location.reload();
			}
		});

		if (typeof window !== 'undefined') {
			if (window.applyTheme) {
				window.applyTheme();
			}
		}

		if (window?.electronAPI) {
			const info = await window.electronAPI.send({
				type: 'app:info'
			});

			if (info) {
				isApp.set(true);
				appInfo.set(info);
			}
		}

		bc.onmessage = (event) => {
			if (event.data === 'active') {
				isLastActiveTab.set(false);
			}
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				isLastActiveTab.set(true);
				bc.postMessage('active');
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		handleVisibilityChange();

		theme.set(localStorage.theme);

		mobile.set(window.innerWidth < BREAKPOINT);

		const onResize = () => {
			if (window.innerWidth < BREAKPOINT) {
				mobile.set(true);
			} else {
				mobile.set(false);
			}
		};
		window.addEventListener('resize', onResize);

		initI18n(localStorage?.locale);
		if (!localStorage.locale) {
			const languages = await getLanguages();
			const browserLanguages = navigator.languages
				? navigator.languages
				: [navigator.language || navigator.userLanguage];
			const lang = bestMatchingLanguage(languages, browserLanguages, 'en-US');
			changeLanguage(lang);
			dayjs.locale(lang);
		}

		await config.set(mockConfig);
		await WEBUI_NAME.set(mockConfig.name);
		await user.set(mockUser);
		await models.set(mockModels);
		settings.set(JSON.parse(localStorage.getItem('settings') ?? '{}'));
		setTextScale($settings?.textScale ?? 1);

		await tick();

		if (
			document.documentElement.classList.contains('her') &&
			document.getElementById('progress-bar')
		) {
			loadingProgress.subscribe((value) => {
				const progressBar = document.getElementById('progress-bar');

				if (progressBar) {
					progressBar.style.width = `${value}%`;
				}
			});

			await loadingProgress.set(100);

			document.getElementById('splash-screen')?.remove();

			const audio = new Audio(`/audio/greeting.mp3`);
			const playAudio = () => {
				audio.play();
				document.removeEventListener('click', playAudio);
			};

			document.addEventListener('click', playAudio);

			loaded = true;
		} else {
			document.getElementById('splash-screen')?.remove();
			loaded = true;
		}

		return () => {
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<svelte:head>
	<title>{$WEBUI_NAME}</title>
	<link crossorigin="anonymous" rel="icon" href="{WEBUI_BASE_URL}/static/favicon.png" />

	<meta name="apple-mobile-web-app-title" content={$WEBUI_NAME} />
	<meta name="description" content={$WEBUI_NAME} />
	<link
		rel="search"
		type="application/opensearchdescription+xml"
		title={$WEBUI_NAME}
		href="/opensearch.xml"
		crossorigin="use-credentials"
	/>
</svelte:head>

{#if showRefresh}
	<div class=" py-5">
		<Spinner className="size-5" />
	</div>
{/if}

{#if loaded}
	{#if $isApp}
		<div class="flex flex-row h-screen">
			<AppSidebar />

			<div class="w-full flex-1 max-w-[calc(100%-4.5rem)]">
				<slot />
			</div>
		</div>
	{:else}
		<slot />
	{/if}
{/if}

<Toaster
	theme={$theme.includes('dark')
		? 'dark'
		: $theme === 'system'
			? window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
			: 'light'}
	richColors
	position="top-right"
	closeButton
/>
