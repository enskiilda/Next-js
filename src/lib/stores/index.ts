import { create } from 'zustand';
import { APP_NAME } from '@/lib/constants';
import emojiShortCodes from '@/lib/emoji-shortcodes.json';

// Pre-compute the short codes to emojis mapping
const computedShortCodesToEmojis = Object.entries(emojiShortCodes).reduce((acc: Record<string, string>, [key, value]) => {
	if (typeof value === 'string') {
		acc[value] = key;
	} else {
		for (const v of value as string[]) {
			acc[v] = key;
		}
	}
	return acc;
}, {});

export type Model = OpenAIModel | OllamaModel;

type BaseModel = {
	id: string;
	name: string;
	info?: any;
	owned_by: 'ollama' | 'openai' | 'arena';
};

export interface OpenAIModel extends BaseModel {
	owned_by: 'openai';
	external: boolean;
	source?: string;
}

export interface OllamaModel extends BaseModel {
	owned_by: 'ollama';
	details: OllamaModelDetails;
	size: number;
	description: string;
	model: string;
	modified_at: string;
	digest: string;
	ollama?: {
		name?: string;
		model?: string;
		modified_at: string;
		size?: number;
		digest?: string;
		details?: {
			parent_model?: string;
			format?: string;
			family?: string;
			families?: string[];
			parameter_size?: string;
			quantization_level?: string;
		};
		urls?: number[];
	};
}

type OllamaModelDetails = {
	parent_model: string;
	format: string;
	family: string;
	families: string[] | null;
	parameter_size: string;
	quantization_level: string;
};

type Settings = {
	pinnedModels?: never[];
	toolServers?: never[];
	detectArtifacts?: boolean;
	showUpdateToast?: boolean;
	showChangelog?: boolean;
	showEmojiInCall?: boolean;
	voiceInterruption?: boolean;
	collapseCodeBlocks?: boolean;
	expandDetails?: boolean;
	notificationSound?: boolean;
	notificationSoundAlways?: boolean;
	stylizedPdfExport?: boolean;
	notifications?: any;
	imageCompression?: boolean;
	imageCompressionSize?: any;
	textScale?: number;
	widescreenMode?: null;
	largeTextAsFile?: boolean;
	promptAutocomplete?: boolean;
	hapticFeedback?: boolean;
	responseAutoCopy?: any;
	richTextInput?: boolean;
	params?: any;
	userLocation?: any;
	webSearch?: any;
	memory?: boolean;
	autoTags?: boolean;
	autoFollowUps?: boolean;
	splitLargeChunks?(body: any, splitLargeChunks: any): unknown;
	backgroundImageUrl?: null;
	landingPageMode?: string;
	iframeSandboxAllowForms?: boolean;
	iframeSandboxAllowSameOrigin?: boolean;
	scrollOnBranchChange?: boolean;
	directConnections?: null;
	chatBubble?: boolean;
	copyFormatted?: boolean;
	models?: string[];
	conversationMode?: boolean;
	speechAutoSend?: boolean;
	responseAutoPlayback?: boolean;
	audio?: AudioSettings;
	showUsername?: boolean;
	notificationEnabled?: boolean;
	highContrastMode?: boolean;
	title?: TitleSettings;
	showChatTitleInTab?: boolean;
	splitLargeDeltas?: boolean;
	chatDirection?: 'LTR' | 'RTL' | 'auto';
	ctrlEnterToSend?: boolean;
	system?: string;
	seed?: number;
	temperature?: string;
	repeat_penalty?: string;
	top_k?: string;
	top_p?: string;
	num_ctx?: string;
	num_batch?: string;
	num_keep?: string;
	options?: ModelOptions;
};

type ModelOptions = {
	stop?: boolean;
};

type AudioSettings = {
	stt: any;
	tts: any;
	STTEngine?: string;
	TTSEngine?: string;
	speaker?: string;
	model?: string;
	nonLocalVoices?: boolean;
};

type TitleSettings = {
	auto?: boolean;
	model?: string;
	modelExternal?: string;
	prompt?: string;
};

type Prompt = {
	command: string;
	user_id: string;
	title: string;
	content: string;
	timestamp: number;
};

type Document = {
	collection_name: string;
	filename: string;
	name: string;
	title: string;
};

type Config = {
	license_metadata: any;
	status: boolean;
	name: string;
	version: string;
	default_locale: string;
	default_models: string;
	default_prompt_suggestions: PromptSuggestion[];
	features: {
		auth: boolean;
		auth_trusted_header: boolean;
		enable_api_keys: boolean;
		enable_signup: boolean;
		enable_login_form: boolean;
		enable_web_search?: boolean;
		enable_google_drive_integration: boolean;
		enable_onedrive_integration: boolean;
		enable_image_generation: boolean;
		enable_admin_export: boolean;
		enable_admin_chat_access: boolean;
		enable_community_sharing: boolean;
		enable_autocomplete_generation: boolean;
		enable_direct_connections: boolean;
		enable_version_update_check: boolean;
	};
	oauth: {
		providers: {
			[key: string]: string;
		};
	};
	ui?: {
		pending_user_overlay_title?: string;
		pending_user_overlay_description?: string;
	};
};

type PromptSuggestion = {
	content: string;
	title: [string, string];
};

export type SessionUser = {
	permissions: any;
	id: string;
	email: string;
	name: string;
	role: string;
	profile_image_url: string;
};

export type Banner = {
	id: string;
	type: string;
	title: string;
	content: string;
	dismissible: boolean;
	timestamp: number;
};

interface AppState {
	WEBUI_NAME: string;
	setWEBUI_NAME: (name: string) => void;
	WEBUI_VERSION: string | null;
	setWEBUI_VERSION: (version: string | null) => void;
	WEBUI_DEPLOYMENT_ID: string | null;
	setWEBUI_DEPLOYMENT_ID: (id: string | null) => void;
	config: Config | undefined;
	setConfig: (config: any) => void;
	user: SessionUser | undefined;
	setUser: (user: any) => void;
	isApp: boolean;
	setIsApp: (isApp: boolean) => void;
	appInfo: any;
	setAppInfo: (info: any) => void;
	appData: any;
	setAppData: (data: any) => void;
	MODEL_DOWNLOAD_POOL: Record<string, any>;
	setMODEL_DOWNLOAD_POOL: (pool: Record<string, any>) => void;
	mobile: boolean;
	setMobile: (mobile: boolean) => void;
	socket: any;
	setSocket: (socket: any) => void;
	activeUserIds: string[] | null;
	setActiveUserIds: (ids: string[] | null) => void;
	USAGE_POOL: string[] | null;
	setUSAGE_POOL: (pool: string[] | null) => void;
	theme: string;
	setTheme: (theme: string) => void;
	shortCodesToEmojis: Record<string, string>;
	TTSWorker: any;
	setTTSWorker: (worker: any) => void;
	chatId: string;
	setChatId: (id: string) => void;
	chatTitle: string;
	setChatTitle: (title: string) => void;
	channels: any[];
	setChannels: (channels: any[]) => void;
	chats: any[] | null;
	setChats: (chats: any[] | null) => void;
	pinnedChats: any[];
	setPinnedChats: (chats: any[]) => void;
	tags: any[];
	setTags: (tags: any[]) => void;
	folders: any[];
	setFolders: (folders: any[]) => void;
	selectedFolder: any;
	setSelectedFolder: (folder: any) => void;
	models: Model[];
	setModels: (models: Model[]) => void;
	prompts: Prompt[] | null;
	setPrompts: (prompts: Prompt[] | null) => void;
	knowledge: Document[] | null;
	setKnowledge: (knowledge: Document[] | null) => void;
	tools: any;
	setTools: (tools: any) => void;
	functions: any;
	setFunctions: (functions: any) => void;
	toolServers: any[];
	setToolServers: (servers: any[]) => void;
	banners: Banner[];
	setBanners: (banners: Banner[]) => void;
	settings: Settings;
	setSettings: (settings: Settings) => void;
	audioQueue: any;
	setAudioQueue: (queue: any) => void;
	showSidebar: boolean;
	setShowSidebar: (show: boolean) => void;
	showSearch: boolean;
	setShowSearch: (show: boolean) => void;
	showSettings: boolean;
	setShowSettings: (show: boolean) => void;
	showShortcuts: boolean;
	setShowShortcuts: (show: boolean) => void;
	showArchivedChats: boolean;
	setShowArchivedChats: (show: boolean) => void;
	showChangelog: boolean;
	setShowChangelog: (show: boolean) => void;
	showControls: boolean;
	setShowControls: (show: boolean) => void;
	showEmbeds: boolean;
	setShowEmbeds: (show: boolean) => void;
	showOverview: boolean;
	setShowOverview: (show: boolean) => void;
	showArtifacts: boolean;
	setShowArtifacts: (show: boolean) => void;
	showCallOverlay: boolean;
	setShowCallOverlay: (show: boolean) => void;
	artifactCode: any;
	setArtifactCode: (code: any) => void;
	artifactContents: any;
	setArtifactContents: (contents: any) => void;
	embed: any;
	setEmbed: (embed: any) => void;
	temporaryChatEnabled: boolean;
	setTemporaryChatEnabled: (enabled: boolean) => void;
	scrollPaginationEnabled: boolean;
	setScrollPaginationEnabled: (enabled: boolean) => void;
	currentChatPage: number;
	setCurrentChatPage: (page: number) => void;
	isLastActiveTab: boolean;
	setIsLastActiveTab: (isActive: boolean) => void;
	playingNotificationSound: boolean;
	setPlayingNotificationSound: (playing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
	WEBUI_NAME: APP_NAME,
	setWEBUI_NAME: (name) => set({ WEBUI_NAME: name }),
	WEBUI_VERSION: null,
	setWEBUI_VERSION: (version) => set({ WEBUI_VERSION: version }),
	WEBUI_DEPLOYMENT_ID: null,
	setWEBUI_DEPLOYMENT_ID: (id) => set({ WEBUI_DEPLOYMENT_ID: id }),
	config: undefined,
	setConfig: (config) => set({ config }),
	user: undefined,
	setUser: (user) => set({ user }),
	isApp: false,
	setIsApp: (isApp) => set({ isApp }),
	appInfo: null,
	setAppInfo: (info) => set({ appInfo: info }),
	appData: null,
	setAppData: (data) => set({ appData: data }),
	MODEL_DOWNLOAD_POOL: {},
	setMODEL_DOWNLOAD_POOL: (pool) => set({ MODEL_DOWNLOAD_POOL: pool }),
	mobile: false,
	setMobile: (mobile) => set({ mobile }),
	socket: null,
	setSocket: (socket) => set({ socket }),
	activeUserIds: null,
	setActiveUserIds: (ids) => set({ activeUserIds: ids }),
	USAGE_POOL: null,
	setUSAGE_POOL: (pool) => set({ USAGE_POOL: pool }),
	theme: 'system',
	setTheme: (theme) => set({ theme }),
	shortCodesToEmojis: computedShortCodesToEmojis,
	TTSWorker: null,
	setTTSWorker: (worker) => set({ TTSWorker: worker }),
	chatId: '',
	setChatId: (id) => set({ chatId: id }),
	chatTitle: '',
	setChatTitle: (title) => set({ chatTitle: title }),
	channels: [],
	setChannels: (channels) => set({ channels }),
	chats: null,
	setChats: (chats) => set({ chats }),
	pinnedChats: [],
	setPinnedChats: (chats) => set({ pinnedChats: chats }),
	tags: [],
	setTags: (tags) => set({ tags }),
	folders: [],
	setFolders: (folders) => set({ folders }),
	selectedFolder: null,
	setSelectedFolder: (folder) => set({ selectedFolder: folder }),
	models: [],
	setModels: (models) => set({ models }),
	prompts: null,
	setPrompts: (prompts) => set({ prompts }),
	knowledge: null,
	setKnowledge: (knowledge) => set({ knowledge }),
	tools: null,
	setTools: (tools) => set({ tools }),
	functions: null,
	setFunctions: (functions) => set({ functions }),
	toolServers: [],
	setToolServers: (servers) => set({ toolServers: servers }),
	banners: [],
	setBanners: (banners) => set({ banners }),
	settings: {},
	setSettings: (settings) => set({ settings }),
	audioQueue: null,
	setAudioQueue: (queue) => set({ audioQueue: queue }),
	showSidebar: false,
	setShowSidebar: (show) => set({ showSidebar: show }),
	showSearch: false,
	setShowSearch: (show) => set({ showSearch: show }),
	showSettings: false,
	setShowSettings: (show) => set({ showSettings: show }),
	showShortcuts: false,
	setShowShortcuts: (show) => set({ showShortcuts: show }),
	showArchivedChats: false,
	setShowArchivedChats: (show) => set({ showArchivedChats: show }),
	showChangelog: false,
	setShowChangelog: (show) => set({ showChangelog: show }),
	showControls: false,
	setShowControls: (show) => set({ showControls: show }),
	showEmbeds: false,
	setShowEmbeds: (show) => set({ showEmbeds: show }),
	showOverview: false,
	setShowOverview: (show) => set({ showOverview: show }),
	showArtifacts: false,
	setShowArtifacts: (show) => set({ showArtifacts: show }),
	showCallOverlay: false,
	setShowCallOverlay: (show) => set({ showCallOverlay: show }),
	artifactCode: null,
	setArtifactCode: (code) => set({ artifactCode: code }),
	artifactContents: null,
	setArtifactContents: (contents) => set({ artifactContents: contents }),
	embed: null,
	setEmbed: (embed) => set({ embed }),
	temporaryChatEnabled: false,
	setTemporaryChatEnabled: (enabled) => set({ temporaryChatEnabled: enabled }),
	scrollPaginationEnabled: false,
	setScrollPaginationEnabled: (enabled) => set({ scrollPaginationEnabled: enabled }),
	currentChatPage: 1,
	setCurrentChatPage: (page) => set({ currentChatPage: page }),
	isLastActiveTab: true,
	setIsLastActiveTab: (isActive) => set({ isLastActiveTab: isActive }),
	playingNotificationSound: false,
	setPlayingNotificationSound: (playing) => set({ playingNotificationSound: playing }),
}));
