<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import { Avatar, Card, Modal, Tooltip } from 'flowbite-svelte';
	import {
		CheckCircleSolid,
		CloseCircleSolid,
		ExclamationCircleSolid
	} from 'flowbite-svelte-icons';

	let showCredModal: boolean = false;
	let verificationStatus: 'verified' | 'pending' | 'failed' = 'pending';
</script>

<h1 class="text-2xl font-bold text-gray-700 mb-5">New VCV</h1>

<h1 class="text-lg font-semibold text-gray-600 mb-5">
	Select the credentials to be displayed in "Experience" Section from the following:
</h1>
<div class="flex flex-col gap-3">
	<div class="flex gap-5">
		<Checkbox></Checkbox>
		<Card padding="xs">
			<div class="flex gap-5 justify-between items-center">
				<div class="flex gap-3">
					<Avatar rounded size="md" class="object-cover" src="" />
					<div class="flex flex-col border-b-gray-300">
						<h3 class="text-md font-semibold text-gray-500">Internship Certificate</h3>
						<p class="text-sm">The Amazing Company</p>
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
				<h1 class="text-2xl font-bold text-gray-600 flex items-center gap-2">
					Internship Certificate
					{#if verificationStatus === 'verified'}
						<CheckCircleSolid class="text-brand-green"></CheckCircleSolid>
						<Tooltip type="light"><p class="text-xs">Verified by VCV</p></Tooltip>
					{:else if verificationStatus === 'pending'}
						<ExclamationCircleSolid class="text-brand-yellow"></ExclamationCircleSolid>
						<Tooltip type="light"><p class="text-xs">Verification Pending</p></Tooltip>
					{:else if verificationStatus === 'failed'}
						<CloseCircleSolid class="text-red-400"></CloseCircleSolid>
						<Tooltip type="light"><p class="text-xs">Verification Failed</p></Tooltip>
					{/if}
				</h1>
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
