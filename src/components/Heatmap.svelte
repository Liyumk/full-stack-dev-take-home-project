<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import DropDown from './DropDown.svelte';
	import * as d3 from 'd3';
	import { trpc } from '$lib/trpc';
	import type { DataPoint } from './types';
	import { DATE_RANGE } from '../types/heatmap.type';

	const legendColors = ['#FFECE3', '#FBAB8F', '#FF7875', '#E6352B', '#800020'];
	let selectedDateRange = DATE_RANGE.LAST_WEEK;
	let isLoading = false;
	let heatmapData: DataPoint[] = [];

	async function fetchHeatmapData(dateRange: DATE_RANGE) {
		isLoading = true;
		try {
			const response = await trpc.heatmap.getHeatmapData.query({ dateRange });
			heatmapData = response;
			console.log('Heatmap data:', heatmapData);
		} catch (error) {
			console.error('Error fetching heatmap data:', error);
		} finally {
			isLoading = false;
		}
	}

	// Fetch data whenever selectedDateRange changes
	$: {
		fetchHeatmapData(selectedDateRange);
	}

	onMount(() => {
		fetchHeatmapData(selectedDateRange);
	});

	afterUpdate(() => {
		if (!isLoading && heatmapData.length > 0) {
			drawHeatmap(heatmapData);
		}
	});

	function drawHeatmap(data: DataPoint[]): void {
		if (!data || data.length === 0) return;

		const margin = { top: 20, right: 20, bottom: 20, left: 40 };
		const width = 1200 - margin.left - margin.right;
		const height = 250 - margin.top - margin.bottom;

		// Clear the existing SVG
		d3.select('#heatmap').selectAll('svg').remove();

		const svg = d3
			.select('#heatmap')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleBand<number>()
			.range([0, width])
			.domain(Array.from(new Set(data.map((d) => d.hour))))
			.padding(0.05);

		const y = d3
			.scaleBand<string>()
			.range([height, 0])
			.domain(Array.from(new Set(data.map((d) => d.country))))
			.padding(0.05);

		const colorScale = d3
			.scaleQuantize<string>()
			.domain([0, d3.max(data, (d) => d.value) ?? 1])
			.range(legendColors);

		const circleRadius = 7.5; // radius for 15x15 px circles

		// Create gridlines
		const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(x.domain().length);
		const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(y.domain().length);

		// Add gridlines
		svg
			.append('g')
			.attr('class', 'x axis-grid')
			.attr('transform', `translate(0,${height})`)
			.call(xAxisGrid)
			.selectAll('line')
			.attr('stroke', '#F0EFEF')
			.attr('stroke-width', 1);

		svg
			.append('g')
			.attr('class', 'y axis-grid')
			.call(yAxisGrid)
			.selectAll('line')
			.attr('stroke', '#F0EFEF')
			.attr('stroke-width', 1);

		// Add circles centered in grid cells
		svg
			.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', (d) => x(d.hour)! + x.bandwidth() / 2)
			.attr('cy', (d) => y(d.country)! + y.bandwidth() / 2)
			.attr('r', circleRadius)
			.style('fill', (d) => (d.value !== 0 ? colorScale(d.value) : 'white'))
			.style('stroke', (d) => (d.value !== 0 ? 'white' : '#F0F0F0'));

		// Add x and y axes
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(
				d3
					.axisBottom(x)
					.tickValues([1, 12, 24])
					.tickFormat((d) => `${d}hr`)
					.tickSize(0)
			);

		svg.append('g').call(d3.axisLeft(y).tickSize(0));

		// Remove the top and right axis lines
		svg.select('.x.axis-grid').selectAll('.domain').remove(); // Remove the bottom border line
		svg.select('.y.axis-grid').selectAll('.domain').remove(); // Remove the left border line
	}

	// Initial fetch on mount
</script>

<div class="flex flex-col w-full gap-y-8 min-h-[500px] max-w-[1300px] min-w-[1300px] py-12">
	<div class="relative flex flex-row justify-between w-full">
		<p class="text-lg font-medium">Web Traffics</p>
		<DropDown
			on:updateSelectedDate={(event) => (selectedDateRange = event.detail)}
			{selectedDateRange}
		/>
	</div>

	{#if isLoading}
		<div>...loading</div>
	{:else}
		<div class="w-full rounded-md py-8 bg-white border">
			<div class="flex justify-between pl-6 pr-10">
				<p class="text-md font-semibold">Unique Destination Heatmap</p>
				<div class="flex items-center gap-x-4">
					<p class="text-sm text-[10px]">Less to more unique visitors</p>
					<div class="flex gap-x-1">
						{#each legendColors as legendColor}
							<div class="rounded-full w-2 h-2" style="background-color: {legendColor};"></div>
						{/each}
					</div>
				</div>
			</div>
			<div id="heatmap" />
		</div>
	{/if}
</div>
