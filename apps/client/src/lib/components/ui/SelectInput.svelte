<script lang="ts">
	import { Select } from 'flowbite-svelte';
	import { Helper, Label } from 'flowbite-svelte';

	export let label: string = '';
	export let helperText: string = '';
	export let value: string | null;
	export let classExtras: string = '';

	$: console.log(value);

	let inputClass =
		`text-gray-900 bg-gray-200 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 focus:border-brand-green focus:ring-brand-green dark:focus:border-brand-green dark:focus:ring-brand-green ` +
		classExtras;

	function handleChange(e) {
		value = e.target.value;
	}
</script>

<div class="flex gap-1">
	<Label for="input" class="text-font-medium text-md mb-1 dark:text-gray-300">
		{label}
	</Label>
</div>

<Select
	bind:value
	defaultClass={inputClass}
	{...$$props}
	on:change
	on:contextmenu
	on:input
	on:change={handleChange}><slot /></Select
>

{#if helperText}
	<Helper class="ms-1 mt-1 text-gray-500 dark:text-gray-400">{helperText}</Helper>
{/if}
