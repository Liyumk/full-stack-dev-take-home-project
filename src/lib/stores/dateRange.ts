import { writable } from 'svelte/store';

export const dateRange = writable<
	'last_week' | 'last_two_weeks' | 'last_month' | 'last_quarter' | 'last_year'
>('last_week');
