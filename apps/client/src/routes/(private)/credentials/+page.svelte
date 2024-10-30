<script lang="ts">
	import DocPreviewBar from '$lib/components/fragments/DocPreviewBar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		Avatar,
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
	import { DotsHorizontalOutline } from 'flowbite-svelte-icons';
	import moment from 'moment';

	let selected: boolean = false;
</script>

<main class="flex gap-5">
	<Card padding="lg" class="max-w-full overflow-x-hidden shadow-xl h-[calc(100vh-130px)]">
		<h1 class="text-3xl font-bold text-gray-700 mb-10">Your Credentials</h1>
		<Table divClass="w-full" striped>
			<TableHead class="text-gray-500 bg-gray-100">
				<TableHeadCell>Credential Name</TableHeadCell>
				<TableHeadCell>Credential Type</TableHeadCell>
				<TableHeadCell>Issued By</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell></TableHeadCell>
			</TableHead>
			<TableBody>
				<TableBodyRow>
					<TableBodyCell class="text-gray-600">National ID</TableBodyCell>
					<TableBodyCell class="text-gray-600">Verifible Credential</TableBodyCell>
					<TableBodyCell class="text-gray-600">The Government</TableBodyCell>
					<TableBodyCell class="text-gray-600">
						<div class="flex justify-between">
							{moment().format('DD MMM YYYY')}
						</div>
					</TableBodyCell>
					<TableBodyCell class="text-gray-600">
						<div class="flex justify-between">
							<button class="text-primary-500 hover:text-primary-600">
								<DotsHorizontalOutline class="h-5 w-5 text-gray-800" />
								<Dropdown border class="py-2">
									<DropdownItem>View Credential</DropdownItem>
									<DropdownItem>Delete Credential</DropdownItem>
								</Dropdown>
							</button>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			</TableBody>
		</Table>
	</Card>
	<DocPreviewBar>
		<div class="flex flex-col h-full px-3 py-3">
			{#if selected}
				<div class="flex items-center justify-end mb-5">
					<CloseButton on:click={() => (selected = false)} />
				</div>
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-4">
						<Avatar rounded size="lg" class="object-cover" src="" />
						<h1 class="text-2xl font-bold text-gray-600">National ID</h1>
					</div>
					<div class="flex flex-col border-b-2 border-b-gray-300 pb-4">
						<h3 class="font-sm font-semibold text-gray-500">Issued By</h3>
						<p>The Government</p>
					</div>
					<div class="flex flex-col border-b-gray-300 pb-4">
						<h3 class="font-sm font-semibold text-gray-500">Other Details</h3>
						<p>other details about the credential.</p>
					</div>
					<div class="flex flex-col border-b-gray-300 pb-4">
						<h3 class="font-sm font-semibold text-gray-500">Other Details</h3>
						<p>other details about the credential.</p>
					</div>
					<div class="flex flex-col border-b-gray-300 pb-4">
						<h3 class="font-sm font-semibold text-gray-500">Other Details</h3>
						<p>other details about the credential.</p>
					</div>
					<div class="flex flex-col border-b-gray-300 pb-4">
						<h3 class="font-sm font-semibold text-gray-500">Other Details</h3>
						<p>other details about the credential.</p>
					</div>
					<div class="flex flex-col border-b-gray-300 pb-4">
						<h3 class="font-sm font-semibold text-gray-500">Other Details</h3>
						<p>other details about the credential.</p>
					</div>
					<div class="flex flex-col border-b-gray-300 pb-4">
						<h3 class="font-sm font-semibold text-gray-500">Other Details</h3>
						<p>other details about the credential.</p>
					</div>
				</div>
			{:else}
				<h1 class="w-full text-lg py-10 text-center">Please select a credential.</h1>
			{/if}
		</div>
	</DocPreviewBar>
</main>
