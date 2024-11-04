<script lang="ts">
	import { Checkbox, Label } from 'flowbite-svelte';
	import type { ComponentProps } from 'svelte';

	export let checked: boolean;
	export let checkedColor: 'yellow' | 'green' = 'green';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props extends Omit<ComponentProps<Checkbox>, 'checked'> {
		checked: boolean;
		noTooltip: boolean;
	}
</script>

<div class="flex gap-1">
	<Checkbox
		{...$$props}
		id="checkbox"
		class="{checkedColor === 'green' ? 'text-brand-green' : 'text-brand-purple'} focus focus:ring-0"
		on:click
		bind:checked
		on:change
		on:blur
		on:keydown
		on:keypress
	/>
	{#if $$props.label}
		<div class="flex gap-1">
			<Label {...$$props} for="checkbox" class="text-font-medium text-sm">
				{$$props.label}
			</Label>
		</div>
	{/if}
</div>
