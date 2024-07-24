import { writable } from 'svelte/store';
import type { DataPoint } from './components/types';

export const heatmapData = writable<DataPoint[] | null>(null);
export const heatmapDataLoading = writable(false);
export const heatmapDataError = writable(null);
