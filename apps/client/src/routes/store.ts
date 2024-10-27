import { writable } from 'svelte/store';

export type ToastOptions = {
	message: string;
	type?: 'error' | 'info';
	timeout?: number;
};
const toastDefaults: Partial<ToastOptions> = {
	type: 'info',
	timeout: 10_000
};

function revisedRandId() {
	return Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, '')
		.substr(2, 10);
}

export function addToast(toast: ToastOptions) {
	const id = revisedRandId();
	toasts.update((t) => [...t, { id, ...toastDefaults, ...toast }]);
	setTimeout(() => {
		toasts.update((t) => t.filter((_t) => _t.id !== id));
	}, toast.timeout ?? toastDefaults.timeout);
}

export type Toast = ToastOptions & { id: string };

export const toasts = writable<Toast[]>([]);
