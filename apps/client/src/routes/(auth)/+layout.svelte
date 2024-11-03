<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { token } from '$lib/store/store'
	import { goto } from '$app/navigation';

	onMount(async () => {
		if ($token) {
			await goto('/dashboard');
		} else {
			await goto('/login');
		}
	});
</script>

<div class="flex h-screen w-full items-center justify-center">
	<Card padding="sm">
		<div class="flex h-full items-center justify-center">
			<slot />
		</div>
	</Card>
</div>
