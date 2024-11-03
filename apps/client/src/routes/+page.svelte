<script lang="ts">
	import { goto } from '$app/navigation';
	import { token } from '$lib/store/store';
	import { onMount } from 'svelte';

	onMount(async () => {
		if ($token) {
			await goto('/dashboard');
		} else {
			await goto('/login');
		}
	});

	$: console.log($token);
</script>
