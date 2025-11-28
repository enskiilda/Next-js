'use client';

import React from 'react';

interface SettingsModalProps {
	show: boolean;
	onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ show, onClose }) => {
	if (!show) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />
			<div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto m-4">
				<div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
					<button
						className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
						onClick={onClose}
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div className="p-6">
					<p className="text-gray-600 dark:text-gray-400">
						Settings content goes here.
					</p>
				</div>
			</div>
		</div>
	);
};

export default SettingsModal;
