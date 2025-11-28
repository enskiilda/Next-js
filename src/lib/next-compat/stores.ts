import { create } from 'zustand';

interface PageStore {
	url: {
		pathname: string;
		searchParams: URLSearchParams;
		href: string;
	};
	params: Record<string, string>;
	setUrl: (url: PageStore['url']) => void;
	setParams: (params: Record<string, string>) => void;
}

export const usePageStore = create<PageStore>((set) => ({
	url: {
		pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
		searchParams: typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams(),
		href: typeof window !== 'undefined' ? window.location.href : '/'
	},
	params: {},
	setUrl: (url) => set({ url }),
	setParams: (params) => set({ params })
}));

export const page = {
	subscribe: (callback: (value: { url: PageStore['url']; params: Record<string, string> }) => void) => {
		const state = usePageStore.getState();
		callback({ url: state.url, params: state.params });
		return usePageStore.subscribe((state) => callback({ url: state.url, params: state.params }));
	}
};
