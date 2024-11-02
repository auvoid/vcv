<script lang="ts">
	import { goto } from '$app/navigation';
	import DocPreviewBar from '$lib/components/fragments/DocPreviewBar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
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
	import {
		CheckCircleSolid,
		DotsHorizontalOutline,
		ExclamationCircleSolid
	} from 'flowbite-svelte-icons';
	import moment from 'moment';

	let selectedDoc: boolean;
	let docName: string;
	let signingParties: string[];
	let isSigned: boolean;
	let creds: string[];
</script>

<main class="flex gap-5">
	<Card padding="lg" class="max-w-full overflow-x-hidden shadow-xl h-[calc(100vh-130px)]">
		<h1 class="text-3xl font-bold text-gray-700 mb-10">Your VCVs</h1>
		<Table divClass="w-full" striped>
			<TableHead class="text-gray-500 bg-gray-100">
				<TableHeadCell>VCV Name</TableHeadCell>
				<TableHeadCell>Date Completed</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
			</TableHead>
			<TableBody>
				{#if creds}
					<TableBodyRow>
						<TableBodyCell class="text-gray-600">The CV</TableBodyCell>
						<TableBodyCell class="text-gray-600">{moment().format('DD MMM YYYY')}</TableBodyCell>
						<TableBodyCell class="text-gray-600">
							<div class="flex justify-between">
								<Badge color="green">Completed</Badge>
								<button class="text-primary-500 hover:text-primary-600">
									<DotsHorizontalOutline class="h-5 w-5 text-gray-800" />
									<Dropdown border class="py-2">
										<DropdownItem>View VCV</DropdownItem>
										<DropdownItem>Delete VCV</DropdownItem>
										<DropdownItem>Download VCV</DropdownItem>
										<DropdownItem>Share VCV</DropdownItem>
									</Dropdown>
								</button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<TableBodyCell colspan={5}>
						<div class="flex w-full flex-col items-center gap-4 px-10 py-[22px]">
							<ExclamationCircleSolid class="h-[100px] w-[100px] text-gray-600"
							></ExclamationCircleSolid>
							<p>You don't have any VCVs yet. Create one right now!</p>
							<Button color="yellow" on on:click={() => goto('/new-vcv')}>Create New VCV</Button>
						</div>
					</TableBodyCell>
				{/if}
			</TableBody>
		</Table>
	</Card>

	<div>
		<DocPreviewBar>
			{#if selectedDoc}
				<div class="flex flex-col h-full justify-between">
					<div class="flex flex-col gap-4">
						<div class="flex items-center justify-between">
							<h1 class="font-bold text-2xl">Document Name</h1>
							<div class="cursor-pointer">
								<CloseButton />
							</div>
						</div>
						<div class="flex flex-col gap-5">
							<div class="flex flex-col">
								<h3 class="font-sm font-semibold text-gray-700">Document Name</h3>
								<p>{docName ?? 'My New Document'}</p>
							</div>
							<div class="flex flex-col">
								<h3 class="font-sm font-semibold text-gray-700">Date Created</h3>
								<p>02/09/2023</p>
							</div>
							<div class="flex flex-col">
								<h3 class="font-sm font-semibold text-gray-700">Date Completed</h3>
								<p>12/09/2023</p>
							</div>
							<div class="flex flex-col">
								<h3 class="font-sm font-semibold text-gray-700">Signing Parties</h3>
								{#each signingParties as party}
									<div class="flex items-center gap-3">
										{#if isSigned}
											<CheckCircleSolid class="text-brand-green_dark"></CheckCircleSolid>
										{:else}
											<ExclamationCircleSolid class="text-brand-yellow"></ExclamationCircleSolid>
										{/if}
										{party}
									</div>
								{/each}
							</div>
							<div>
								<h3 class="font-sm font-semibold text-gray-700">PDF File</h3>
								<div>MyPdfFile.pdf (file displayed and on click opens on screen)</div>
							</div>
							<div></div>
						</div>
					</div>
					<div class="flex gap-4 w-full">
						<Button buttonClass="w-full" color="white">Delete Document</Button>
						<Button buttonClass="w-full" color="yellow">View Document</Button>
					</div>
				</div>
			{:else if !creds}
				<p class="w-full py-8 text-center">You don't have any VCV to view yet :(</p>
			{:else if !selectedDoc}
				<p class="w-full py-8 text-center">Please Select a Document to view</p>
			{/if}
		</DocPreviewBar>
	</div>
</main>
