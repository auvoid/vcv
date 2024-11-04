<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { apiClient } from '$lib/axios/axios';
	import CvPreview from '$lib/components/fragments/CvPreview.svelte';
	import DocPreviewBar from '$lib/components/fragments/DocPreviewBar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		Card,
		CloseButton,
		Dropdown,
		DropdownItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { DotsHorizontalOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import moment from 'moment';
	import { onMount, tick } from 'svelte';
	import { PUBLIC_BASE_URI } from '$env/static/public';
	import Loading from '$lib/components/ui/Loading.svelte';

	let cvs: Record<string, any>[];
	let selectedCv: Record<string, any>;
	let loading = false;
	let handlePdfSave: (cv: Record<string, string>) => void | Promise<void>;
	let handleDownloadClick: (cv: Record<string, string>) => void | Promise<void>;
	let makePdf: HTMLDivElement;

	async function handleDelete(id: string) {
		await apiClient.delete(`/cv/${id}`);
		await fetchCvs();
	}

	async function fetchCvs() {
		loading = true;
		const { data } = await apiClient.get('/cv');
		cvs = data;
		loading = false;
	}

	onMount(async () => {
		fetchCvs();
		const html2pdf = (await import('html2pdf.js')).default;
		let html2PdfWorker = html2pdf();
		handlePdfSave = async (cv) => {
			let opt = {
				margin: [0, 0, 0, 0],
				filename: 'YourVCV.pdf',
				image: { type: 'png' },
				html2canvas: { scale: 2 },
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'p', putOnlyUsedFonts: true }
			};
			const doc = await html2PdfWorker.from(makePdf).set(opt).toPdf().get('pdf');
			console.log(cv.id);
			await doc.addMetadata(cv.id, PUBLIC_BASE_URI);
			console.log(doc);
			doc.save('VCV.pdf');
		};
		handleDownloadClick = async (cv: Record<string, string>) => {
			selectedCv = cv;
			// wait for dom data
			await tick();
			handlePdfSave(cv);
		};

		const urlParams = new URLSearchParams($page.url.search);
	});
</script>

<main class="flex gap-5">
	<Card
		padding="lg"
		class="max-w-[calc(100%-640px)] overflow-x-hidden shadow-xl h-[calc(100vh-130px)]"
	>
		<h1 class="text-3xl font-bold text-gray-700 mb-10">Your VCVs</h1>
		{#if loading}
			<Loading></Loading>
		{:else}
			<Table divClass="w-full" striped>
				<TableHead class="text-gray-500 bg-gray-100">
					<TableHeadCell>VCV Name</TableHeadCell>
					<TableHeadCell>Created At</TableHeadCell>
				</TableHead>
				<TableBody>
					{#if cvs && cvs.length > 0}
						{#each cvs as cv (cv.id)}
							<TableBodyRow>
								<TableBodyCell class="text-gray-600">{cv.cvName}</TableBodyCell>
								<TableBodyCell class="text-gray-600">
									<div class="flex justify-between">
										{moment(cv.createdAt).format('DD MMM YYYY')}
										<button class="text-primary-500 hover:text-primary-600">
											<DotsHorizontalOutline class="h-5 w-5 text-gray-800" />
											<Dropdown border class="py-2">
												<DropdownItem on:click={() => (selectedCv = cv)}>View VCV</DropdownItem>
												<DropdownItem on:click={() => goto(`/new-vcv?id=${cv.id}`)}
													>Edit VCV</DropdownItem
												>
												<DropdownItem on:click={() => handleDelete(cv.id)}>Delete VCV</DropdownItem>
												<DropdownItem on:click={() => handleDownloadClick(cv)}
													>Download VCV</DropdownItem
												>
											</Dropdown>
										</button>
									</div>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					{:else}
						<TableBodyCell colspan={2}>
							<div class="flex w-full flex-col items-center gap-4 px-10 py-[22px]">
								<ExclamationCircleSolid class="h-[100px] w-[100px] text-gray-600"
								></ExclamationCircleSolid>
								<p>You don't have any VCVs yet. Create one right now!</p>
								<Button color="purple" on on:click={() => goto('/new-vcv')}>Create New VCV</Button>
							</div>
						</TableBodyCell>
					{/if}
				</TableBody>
			</Table>
		{/if}
	</Card>

	<div>
		<DocPreviewBar extraClass="min-w-[620px] shadow-xl h-[calc(100vh-130px)] overflow-auto">
			{#if selectedCv}
				<div class="flex items-center justify-end">
					<CloseButton on:click={() => (selectedCv = null)} />
				</div>
				<CvPreview
					name={selectedCv.name}
					credentials={selectedCv.credentials}
					role={selectedCv.jobTitle}
					intro={selectedCv.bio}
					linkedin={selectedCv.contacts.linkedin}
					phoneNum={selectedCv.contacts.phone}
					email={selectedCv.contacts.email}
					cvId={selectedCv.id}
					bind:toPdf={makePdf}
				></CvPreview>
			{:else}
				<p class="w-full py-8 text-center">Please select a CV to view</p>
			{/if}
		</DocPreviewBar>
	</div>
</main>
