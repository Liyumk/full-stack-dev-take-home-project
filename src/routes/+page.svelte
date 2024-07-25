<script lang="ts">
	import Heatmap from '../components/Heatmap.svelte';
	import Navbar from '../components/Navbar.svelte';
</script>

<svelte:head>
	<title>Traffic Web</title>
</svelte:head>

<main
	class="flex flex-col justify-between items-center w-screen h-screen bg-gray-50 overflow-x-hidden"
>
	<div class="w-full flex flex-col items-center">
		<Navbar />
		<div class="flex">
			<Heatmap />
		</div>
	</div>
	<div class="flex justify-center p-10 bg-white w-full">
		<p>© 2024 Web Traffics Inc. All rights reserved.</p>
	</div>
</main>
