export const goto = (url: string, options?: { replaceState?: boolean }) => {
	if (typeof window !== 'undefined') {
		if (options?.replaceState) {
			window.history.replaceState(null, '', url);
		} else {
			window.location.href = url;
		}
	}
};

export const beforeNavigate = (callback: (navigation: { willUnload: boolean; to: { url: URL } | null }) => void) => {
};

export const afterNavigate = (callback: () => void) => {
};

export const invalidate = (url: string) => {
};

export const invalidateAll = () => {
};

export const preloadData = (url: string) => {
};

export const preloadCode = (url: string) => {
};
