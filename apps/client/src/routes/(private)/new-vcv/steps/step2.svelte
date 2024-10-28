<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import { Avatar, Card, Modal } from 'flowbite-svelte';

	let showCredModal: boolean = false;
</script>

<div class="flex flex-col gap-2">
	<div class="flex gap-5">
		<Checkbox></Checkbox>
		<Card padding="xs">
			<div class="flex gap-5 justify-between items-center">
				<div class="flex gap-3">
					<Avatar rounded size="md" class="object-cover" src="" />
					<div class="flex flex-col border-b-gray-300">
						<h3 class="text-md font-semibold text-gray-500">National ID</h3>
						<p class="text-sm">The Government</p>
					</div>
				</div>
				<div>
					<Button color="light-blue" on:click={() => (showCredModal = true)}>View</Button>
				</div>
			</div>
		</Card>
	</div>
</div>

<Modal title="View Credential" bind:open={showCredModal}>
	<div class="flex flex-col gap-4">
		<div class="flex gap-4 items-center">
			<Avatar rounded size="lg" class="object-cover" src="" />
			<div>
				<h1 class="text-2xl font-bold text-gray-600">National ID</h1>
				<p>Issued by: <spam class="font-semibold"> The Government</spam></p>
			</div>
		</div>
		<div class="flex flex-col border-b-gray-300">
			<h3 class="font-sm font-semibold text-gray-500">Other Details</h3>
			<p>other details about the credential.</p>
		</div>
		<div class="flex flex-col border-b-gray-300">
			<h3 class="font-sm font-semibold text-gray-500">Other Details</h3>
			<p>other details about the credential.</p>
		</div>
		<div class="flex flex-col border-b-gray-300">
			<h3 class="font-sm font-semibold text-gray-500">Other Details</h3>
			<p>other details about the credential.</p>
		</div>
		<div class="flex flex-col border-b-gray-300">
			<h3 class="font-sm font-semibold text-gray-500">Other Details</h3>
			<p>other details about the credential.</p>
		</div>
	</div>
</Modal>
