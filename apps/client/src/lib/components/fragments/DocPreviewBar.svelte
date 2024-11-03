<script lang="ts">
	import { Card } from 'flowbite-svelte';

	export let extraClass: string = 'min-w-[450px] shadow-xl h-[calc(100vh-130px)]';
</script>

<Card class={extraClass}>
	<slot></slot>
</Card>
