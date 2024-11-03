import { persisted } from './persisted';

export const token = persisted<string | null>('token', null);
