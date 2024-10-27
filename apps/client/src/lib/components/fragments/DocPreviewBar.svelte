<script lang="ts">
	import { Card, CloseButton } from 'flowbite-svelte';
	import Button from '../ui/Button.svelte';

	// export let selectedDoc: string;
</script>

<Card class="min-w-[450px] shadow-xl h-[calc(100vh-130px)]">
	<slot></slot>
</Card>
