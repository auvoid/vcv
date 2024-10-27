<script lang="ts">
	import DocPreviewBar from '$lib/components/fragments/DocPreviewBar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Card, Li, Modal } from 'flowbite-svelte';
	import Step1 from './steps/step1.svelte';
	import Step2 from './steps/step2.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { BarsOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';

	let step = 0;
	let docName: string;
	let signingParties: string[];
	let emailContent: string;
	let showSendEmailModal: boolean = false;

	function handleGoBack() {
		if (step === 0) {
			goto('/dashboard');
		} else {
			step--;
		}
	}

	function handleContinue() {
		if (step === 0) {
			step++;
		} else if (step === 1) {
			showSendEmailModal = true;
		}
	}
</script>

<Modal title="Confirm Action" bind:open={showSendEmailModal}>
	<div class="flex flex-col gap-5">
		<div>
			<h1 class="text-lg text-gray-900 font-semibold">
				Are you sure you want to send the doc to the following Signing Parties?
			</h1>
			<p class="text-sm">(Please re-check all the details before sending the document.)</p>
			{#each signingParties as party}
				<div class="text-md text-gray-800">
					<Li>{party}</Li>
				</div>
			{/each}
		</div>
		<div class="flex justify-end">
			<Button color="light-yellow">Continue and Send Emails</Button>
		</div>
	</div>
</Modal>

<div class="flex gap-5">
	{#if step === 0}
		<Step1 bind:docName bind:signingParties bind:emailContent></Step1>
	{:else if step === 1}
		<Step2></Step2>
	{/if}
	<DocPreviewBar>
		<div class="flex flex-col h-full justify-between">
			{#if step === 0}
				<div class="flex flex-col gap-5">
					<div class="flex flex-col">
						<h3 class="font-sm font-semibold text-gray-700 dark:text-gray-400">Document Name</h3>
						<p>{docName}</p>
					</div>
					<div class="flex flex-col">
						<h3 class="font-sm font-semibold text-gray-700 dark:text-gray-400">Signing Parties</h3>
						{#each signingParties as party}
							<div>
								<Li>{party}</Li>
							</div>
						{/each}
					</div>
					<div>
						<h3 class="font-sm font-semibold text-gray-700 dark:text-gray-400">PDF File</h3>
						<div>MyPdfFile.pdf (file displayed and on click opens on screen)</div>
					</div>
					<div>
						<h3 class="font-sm font-semibold text-gray-700 dark:text-gray-400">Your Message</h3>
						<p>
							{emailContent}
						</p>
					</div>
				</div>
			{:else if step === 1}
				<div class="flex flex-col gap-4">
					<div class="flex items-center justify-between">
						<h1 class="font-bold text-2xl dark:text-white">Document Name</h1>
					</div>
					<Card>
						<div class="flex flex-col gap-3">
							<div>
								<Input label="ananya@auvo.io (prefilled email of signing party)" value="Ananya Rana"
								></Input>
							</div>
							<div class="flex justify-between gap-3 items-center">
								<BarsOutline size="xl"></BarsOutline>
								<div class="w-full">
									<Button buttonClass="w-full" color="light-yellow"
										>Place the signature in document</Button
									>
								</div>
							</div>
						</div>
					</Card>
				</div>
			{/if}
			<div class="flex flex-col gap-2">
				<div>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<small
						class="flex w-full cursor-pointer justify-end dark:text-white"
						on:click={handleGoBack}><ChevronLeftOutline></ChevronLeftOutline>Go Back</small
					>
				</div>
				<div class="flex gap-4 w-full">
					<Button buttonClass="w-full" color="white"
						>{step === 0 ? 'Save as Draft' : 'View Document'}</Button
					>
					<Button buttonClass="w-full" color="yellow" on:click={handleContinue}
						>{step === 0 ? 'Continue to Edit Document' : 'Send'}</Button
					>
				</div>
			</div>
		</div>
	</DocPreviewBar>
</div>
