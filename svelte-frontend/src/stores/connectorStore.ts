import { writable } from 'svelte/store';
import type { Connector, ConnectionInstance } from '../types';

export const selectedConnector = writable<Connector | null>(null);
export const connectionInstances = writable<Record<string, ConnectionInstance[]>>({});
export const activeInstanceId = writable<string | null>(null);
export const formData = writable<Record<string, any>>({});
export const validationErrors = writable<Record<string, string>>({});

