<script lang="ts">
	import { Label, Radio } from 'flowbite-svelte';

	export let group: number | string | undefined = undefined;
	export let value: number | string | undefined = '';
</script>

<div class="flex">
	<Radio
		class="text-brand-green ring-0 focus:ring-0"
		id={`radio-${$$props.label}`}
		{...$$props}
		on:change
		bind:group
		on:blur
		on:focus
		on:keydown
		on:keypress
		on:keyup
		{value}
		{...$$restProps}
	></Radio>
	<Label for={`radio-${$$props.label}`} class="text-font-medium text-sm">
		{$$props.label}
	</Label>
</div>
