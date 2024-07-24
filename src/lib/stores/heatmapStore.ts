import { writable } from 'svelte/store';

interface HeatmapState {
	data: any;
	loading: boolean;
	error: string | null;
}

const initialState: HeatmapState = {
	data: null,
	loading: false,
	error: null
};

export const heatmapStore = writable<HeatmapState>(initialState);

export const setLoading = () => heatmapStore.update((state) => ({ ...state, loading: true }));
export const setData = (data: any) =>
	heatmapStore.update((state) => ({ ...state, data, loading: false }));
export const setError = (error: string) =>
	heatmapStore.update((state) => ({ ...state, error, loading: false }));
