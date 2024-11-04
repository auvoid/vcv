<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { twMerge } from 'tailwind-merge';

	interface $$Props extends Omit<ComponentProps<Button>, 'color'> {
		color?: 'purple' | 'white' | 'none';
		buttonClass?: string;
	}

	export let color: $$Props['color'] = 'purple';
	export let buttonClass = '';
	switch (color) {
		case 'purple':
			buttonClass += ' bg-brand-purple text-white hover:bg-brand-purple_hover focus:ring-0';
			break;
		case 'white':
			buttonClass +=
				' bg-gray-50 text-gray-800 border-[1px] hover:bg-gray-100 focus:ring-0 border-gray-300';
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
