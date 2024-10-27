<script lang="ts">
	import { Card } from 'flowbite-svelte';
</script>

<div class="flex h-screen w-full items-center justify-center">
	<Card padding="sm">
		<div class="flex h-full items-center justify-center">
			<slot />
		</div>
	</Card>
</div>
