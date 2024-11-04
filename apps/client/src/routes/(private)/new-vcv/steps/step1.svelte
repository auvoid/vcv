<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';

	export let vcvName: string;
	export let name: string;
	export let role: string;
</script>

<h1 class="text-2xl font-bold text-gray-700 mb-5">New VCV</h1>
<div class="w-full flex flex-col gap-3">
	<div class="">
		<Input variant="text" label="Enter VCV Name" placeholder="My VCV" bind:value={vcvName} />
	</div>
	<div class="">
		<Input variant="text" label="Enter Name" placeholder="John Doe" bind:value={name} />
	</div>
	<div class="">
		<Input variant="text" label="Enter Role" placeholder="Backend Developer" bind:value={role} />
	</div>
</div>
