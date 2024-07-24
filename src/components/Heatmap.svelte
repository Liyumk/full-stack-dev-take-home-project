<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import DropDown from './DropDown.svelte';
	import * as d3 from 'd3';
	import { trpc } from '$lib/trpcClient';
	import { DATE_RANGE, type HeatmapResponse } from '../types/heatmap.type';
	import { Wave } from 'svelte-loading-spinners';
	import { drawHeatmap, legendColors } from '../utils/drawHeatmap';

	let selectedDateRange = DATE_RANGE.LAST_WEEK;
	let isLoading = false;
	let error: string | null = null;
	let heatmapData: HeatmapResponse = [];

	async function fetchHeatmapData(dateRange: DATE_RANGE) {
		isLoading = true;
		try {
			heatmapData = await trpc.heatmap.getHeatmapData.query({ dateRange });
		} catch (error) {
			error = 'Something went wrong, please try again.';
			// console.error('Error fetching heatmap data:', error);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => fetchHeatmapData(selectedDateRange));

	$: fetchHeatmapData(selectedDateRange);

	afterUpdate(() => {
		if (!isLoading && heatmapData?.length > 0) {
			drawHeatmap(heatmapData);
		}
	});
</script>

<div class="flex flex-col w-full gap-y-8 min-h-[500px] max-w-[1300px] min-w-[1300px] py-12">
	<div class="relative flex flex-row justify-between w-full">
		<p class="text-lg font-medium">Web Traffics</p>
		<DropDown
			on:updateSelectedDate={(event) => (selectedDateRange = event.detail)}
			{selectedDateRange}
		/>
	</div>

	<div class="flex flex-col items-center w-full h-full rounded-md py-8 bg-white border">
		<div class="flex w-full justify-between pl-6 pr-10">
			<p class="text-md font-semibold">Unique Destination Heatmap</p>
			<div class="flex items-center gap-x-4">
				<p class="text-sm text-[10px]">Less to more unique visitors</p>
				<div class="flex gap-x-1">
					{#each legendColors as color}
						<div class="rounded-full w-2 h-2" style="background-color: {color};"></div>
					{/each}
				</div>
			</div>
		</div>
		{#if isLoading}
			<div class="flex w-full h-full justify-center items-center">
				<Wave size="60" color="#E6352B" unit="px" duration="1s" />
			</div>
		{:else if error}
			<div class="flex w-full h-full justify-center items-center">
				<p class="text-sm text-gray-8000">{error}</p>
			</div>
		{:else if heatmapData?.length === 0}
			<div class="flex w-full h-full justify-center items-center">
				<p class="text-sm text-gray-800">No data</p>
			</div>
		{:else}
			<div id="heatmap" />
		{/if}
	</div>
</div>

<div id="tooltip" class="tooltip hidden"></div>

<style>
	.tooltip {
		position: absolute;
		background-color: #fff;
		border: 1px solid #ddd;
		padding: 8px;
		border-radius: 4px;
		pointer-events: none;
		font-size: 12px;
		z-index: 10;
	}

	.hidden {
		display: none;
	}
</style>
