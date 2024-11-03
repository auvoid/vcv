<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import { Dropzone, Label } from 'flowbite-svelte';
	import { UploadOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	export let isPdfUploading: boolean;
	export let fileName: undefined | string;
	export let pdfFile: FileList | undefined;

	let uploadHandler: () => Promise<void>;

	const dropHandle = (event: DragEvent) => {
		event.preventDefault();
		if (event.dataTransfer?.items) {
			fileName = [...event.dataTransfer.items][0].getAsFile()?.name;
		}
		if (!pdfFile || !pdfFile[0]) return;
		uploadHandler();
	};

	const handleChange = (event: Event) => {
		const useEvent = event as DragEvent;
		if (useEvent.dataTransfer && useEvent.dataTransfer.items) {
			fileName = [...useEvent.dataTransfer.items][0].getAsFile()?.name;
		}
		if (!pdfFile || !pdfFile[0]) return;
		uploadHandler();
	};

	onMount(async () => {
		const pdfjs = await import('pdfjs-dist');
		pdfjs.GlobalWorkerOptions.workerSrc = '/scripts/pdf.worker.min.mjs';
		uploadHandler = async () => {
			if (!pdfFile || !pdfFile[0]) return;
			const pdfDoc = await pdfjs.getDocument(await pdfFile[0].arrayBuffer()).promise;
			const metadata = (await pdfDoc.getMetadata()).metadata.getAll() as {
				'jspdf:metadata': string;
			};
			if (metadata['jspdf:metadata']) {
				goto(`/verify/${metadata['jspdf:metadata']}`);
			}
		};
	});
</script>

<div class="w-full">
	<Label class="text-font-bold text-md mb-1">Upload Document to be signed</Label>
	{#if !isPdfUploading}
		<Dropzone
			on:drop={dropHandle}
			on:dragover={(event) => {
				event.preventDefault();
			}}
			on:change={handleChange}
			bind:files={pdfFile}
			class="bg-gray-200"
			accept={'.pdf'}
		>
			<UploadOutline size="xl"></UploadOutline>
			{#if !pdfFile}
				<p class="mb-2 text-sm text-gray-500">
					<span class="font-semibold">Click to upload</span> or drag and drop
				</p>
				<p class="text-xs text-gray-500">PDF Format Only (File Size: 30MB)</p>
			{:else}
				<p>{fileName}</p>
				<Button
					on:click={() => {
						pdfFile = undefined;
					}}>Remove</Button
				>
			{/if}
		</Dropzone>
	{:else}
		<p class="bg-gray-200 p-2 rounded-lg border border-gray-300">Pdf is uploading...</p>
	{/if}
</div>
