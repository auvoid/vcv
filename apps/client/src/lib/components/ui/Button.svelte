<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { twMerge } from 'tailwind-merge';

	interface $$Props extends Omit<ComponentProps<Button>, 'color'> {
		color?: 'yellow' | 'white' | 'light-yellow' | 'light-blue' | 'none';
		buttonClass?: string;
	}

	export let color: $$Props['color'] = 'yellow';
	export let buttonClass = '';
	switch (color) {
		case 'yellow':
			buttonClass += ' bg-brand-yellow text-gray-800 hover:bg-brand-yellow_hover focus:ring-0';
			break;
		case 'white':
			buttonClass +=
				' bg-gray-50 text-gray-800 border-[1px] hover:bg-gray-100 focus:ring-0 border-gray-300';
			break;
		case 'light-blue':
			buttonClass +=
				' bg-blue-100 text-gray-800 border-[1px] hover:bg-blue-200 focus:ring-0 border-blue-300';
			break;
		case 'light-yellow':
			buttonClass +=
				' bg-brand-yellow_light text-gray-800 border-[1px] hover:bg-brand-yellow focus:ring-0 border-yellow-300';
			break;
		default:
			buttonClass += '';
			break;
	}
</script>

<Button
	class={twMerge(buttonClass, $$restProps.class)}
	{...$$restProps}
	on:click
	on:change
	on:keydown
	on:keyup
	on:touchend
	on:touchcancel
	on:mouseenter
	on:mouseleave
>
	<slot />
</Button>
