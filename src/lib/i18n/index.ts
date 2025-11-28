import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import type { i18n as i18nType } from 'i18next';

let i18nInstance: i18nType = i18next;
let isLoadingState = false;

export const initI18n = (defaultLocale?: string | undefined) => {
	if (typeof window === 'undefined') return;

	const detectionOrder = defaultLocale
		? ['querystring', 'localStorage']
		: ['querystring', 'localStorage', 'navigator'];
	const fallbackDefaultLocale = defaultLocale ? [defaultLocale] : ['en-US'];

	const loadResource = (language: string, namespace: string) =>
		import(`./locales/${language}/${namespace}.json`);

	i18next
		.use(resourcesToBackend(loadResource))
		.use(LanguageDetector)
		.init({
			debug: false,
			detection: {
				order: detectionOrder,
				caches: ['localStorage'],
				lookupQuerystring: 'lang',
				lookupLocalStorage: 'locale'
			},
			fallbackLng: {
				default: fallbackDefaultLocale
			},
			ns: 'translation',
			returnEmptyString: false,
			interpolation: {
				escapeValue: false
			}
		});

	const lang = i18next?.language || defaultLocale || 'en-US';
	document.documentElement.setAttribute('lang', lang);
};

export const getLanguages = async () => {
	const languages = (await import(`./locales/languages.json`)).default;
	return languages;
};

export const changeLanguage = (lang: string) => {
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('lang', lang);
	}
	i18next.changeLanguage(lang);
};

export const t = (key: string, options?: any) => {
	return i18next.t(key, options);
};

export const useI18n = () => {
	return {
		t: (key: string, options?: any) => i18next.t(key, options),
		changeLanguage,
		language: i18next.language
	};
};

export default i18next;
export const isLoading = () => isLoadingState;
