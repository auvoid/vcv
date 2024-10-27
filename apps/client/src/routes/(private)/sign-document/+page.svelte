<script lang="ts">
	import DocPreviewBar from '$lib/components/fragments/DocPreviewBar.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from 'flowbite-svelte/Modal.svelte';

	import { Card } from 'flowbite-svelte';
	import { CheckCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';

	let isSigned: boolean = false;
	let showConfirmSignModal: boolean = false;
</script>

<Modal title="Confirm Action" bind:open={showConfirmSignModal}>
	<div class="flex flex-col gap-5">
		<div>
			<h1 class="text-lg text-gray-800 font-semibold">
				Are you sure you want to Digitally Sign this document?
			</h1>
		</div>
		<div class="flex">
			<Button color="light-yellow">Continue and Sign Document</Button>
		</div>
	</div>
</Modal>

<main class="w-full flex gap-5">
	<div class="w-full flex gap-5">
		<Card class="shadow-xl max-w-full h-[calc(100vh-130px)]">
			<h1 class="text-3xl font-bold text-gray-700 mb-10">Edit Document Field</h1>
			<div>
				<h1 class="text-2xl font-semibold text-gray-600 mb-10">Document Name</h1>
				Pdf to be displayed here
			</div>
		</Card>
		<DocPreviewBar>
			<div class="flex flex-col h-full justify-between max-w-full">
				<div class="flex flex-col gap-4">
					<h1 class="font-bold text-md dark:text-white">
						{#if isSigned}
							Document Signed!
						{:else}
							Document is waiting for you to complete the Signature field.
						{/if}
					</h1>
					<Card padding="sm">
						<div class="flex flex-col gap-3">
							<div>
								<Input label="" variant="text" disabled={true} value="Ananya Rana"></Input>
								<!-- disabled not working here -->
							</div>
							<div class="flex gap-3 items-center justify-between">
								{#if isSigned}
									<div class="flex gap-1 items-center">
										<CheckCircleSolid class="text-brand-green_dark"></CheckCircleSolid>
										<h2 class="text-xs font-medium">Signature is complete</h2>
									</div>
									<Button color="light-blue">View in Document</Button>
								{:else}
									<div class="flex gap-1 items-center">
										<ExclamationCircleSolid class="text-brand-yellow"></ExclamationCircleSolid>
										<h2 class="text-xs font-medium">Signature Incomplete</h2>
									</div>
									<Button color="light-yellow">Sign this Document</Button>
								{/if}
							</div>
						</div>
					</Card>
				</div>
				<div class="flex flex-col gap-4">
					<div class="text-sm text-gray-500">
						Once you have input all the information required, press the “Sign & Send” button to sign
						and send the document.
					</div>
					<div class="flex gap-4 w-full">
						<Button buttonClass="w-full" color="white" on:click={() => goto('/dashboard')}
							>Cancel</Button
						>
						<Button
							buttonClass="w-full"
							color="yellow"
							on:click={() => (showConfirmSignModal = true)}>Sign & Send</Button
						>
					</div>
				</div>
			</div>
		</DocPreviewBar>
	</div>
</main>
