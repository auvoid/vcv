<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Badge } from 'flowbite-svelte';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props extends Omit<ComponentProps<Badge>, 'color'> {
		color?: 'default' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'gold';
	}
	$: styling = '';
	if (!$$props.color) {
		$$props.color = 'default';
	}
	switch ($$props.color) {
		case 'default':
			styling = 'dark:bg-gray-700 dark:text-gray-300';
			break;
		case 'red':
			styling = 'dark:bg-brand-red_dark dark:text-red-300';
			break;
		case 'yellow':
			styling = 'dark:bg-brand-purple_darkest dark:text-brand-purple';
			break;
		case 'green':
			styling = 'dark:bg-brand-dark_green dark:text-brand-light_green';
			break;
		case 'blue':
			styling = 'dark:bg-brand-blue_dark dark:text-primary-300';
			break;
		case 'indigo':
			styling = 'dark:bg-brand-twilight_dark dark:text-indigo-300';
			break;
		case 'purple':
			styling = 'dark:bg-brand-purple_dark dark:text-purple-300';
			break;
		case 'pink':
			styling = 'dark:bg-brand-pink_dark dark:text-pink-300';
			break;
		default:
			styling = 'dark:bg-gray-700 dark:text-gray-300';
			break;
	}
</script>

<Badge {...$$restProps} class={`cursor-default dark:border-none ${styling}`}>
	<slot />
</Badge>
