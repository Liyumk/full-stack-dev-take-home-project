<script lang="ts">
	import { dateRanges } from '../constants/dateRange';
	import { DATE_RANGE } from '../types/heatmap.type';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const dateRangesEntries = Object.entries(dateRanges) as [DATE_RANGE, string][];
	export let selectedDateRange: DATE_RANGE;

	let isOpen = false;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectDropdown(selectedDate: DATE_RANGE) {
		dispatch('updateSelectedDate', selectedDate);
		isOpen = false;
	}
</script>

<div class="absolute right-0">
	<button
		on:click={toggleDropdown}
		class="min-w-72 min-h-10 text-gray-600 bg-white border-2 border-gray-100 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 text-center inline-flex items-center justify-between divide-x-2"
		type="button"
	>
		<div class="flex w-full justify-between">
			<p>{dateRanges[selectedDateRange]}</p>
			<div class="flex items-center border-l">
				<svg
					class="w-2.5 h-2.5 ms-3"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 10 6"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m1 1 4 4 4-4"
					/>
				</svg>
			</div>
		</div>
	</button>

	<div
		class="min-w-72 z-10 {isOpen
			? 'block'
			: 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
	>
		<ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
			{#each dateRangesEntries as [key, value]}
				<li>
					<button
						on:click={() => {
							selectDropdown(key);
						}}
						class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>{value}
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>
