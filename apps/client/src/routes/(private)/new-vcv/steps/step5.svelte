<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	export let onSavePdfClick: () => void;
</script>

<h1 class="text-2xl font-bold text-gray-700 mb-5">Export your VCV</h1>

<div class="flex flex-col gap-3">
	<div class="flex gap-5">
		<Button color="light-blue" on:click={onSavePdfClick}>Export to PDF</Button>
	</div>
</div>
