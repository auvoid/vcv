import { writable } from 'svelte/store';
import { persisted } from './persisted';

export const token = persisted<string | null>('token', null);
export const user = writable<{
	id: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	verified: boolean;
	emailVerified: boolean;
} | null>();
