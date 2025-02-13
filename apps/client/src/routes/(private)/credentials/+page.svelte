<script lang="ts">
	import { apiClient } from '$lib/axios/axios';
	import DocPreviewBar from '$lib/components/fragments/DocPreviewBar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Qr from '$lib/components/ui/Qr.svelte';
	import SelectInput from '$lib/components/ui/SelectInput.svelte';
	import { createWebsocket } from '$lib/util/ws';
	import {
		Avatar,
		Card,
		Modal,
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
	import { onMount } from 'svelte';
	import { formatDid } from '$lib/util/did';
	import { goto } from '$app/navigation';
	import Loading from '$lib/components/ui/Loading.svelte';

	let loading = false;
	let selectedCredential: Record<string, any>;
	let showAssignCredModal = false;
	let showShareCredModal = false;
	let obtainingDummy = false;
	let qr: string;
	let credentials: Record<string, any>[] = [];
	let credentialAssignmentsMap: Record<string, string | null> = {};
	const items = [
		{ value: 'certification', name: 'Certification Document' },
		{ value: 'education', name: 'Education Document' }
	];

	function createAssignmentMap(credentials: Record<string, any>[]) {
		const credentialsMap: Record<string, string | null> = {};
		credentials.forEach((c) => (credentialsMap[c.id] = c.type));
		credentialAssignmentsMap = credentialsMap;
	}

	async function handleShowAssignmentModal() {
		await fetchCredentials();
		showAssignCredModal = true;
	}

	async function handleShareCredentials() {
		const {
			data: { uri }
		} = await apiClient.get('/oid4vc/pex');
		qr = uri;
		showShareCredModal = true;
		const ws = createWebsocket();
		ws.onmessage = async (event) => {
			const data = JSON.parse(event.data);
			if (data.success) {
				fetchCredentials();
				showShareCredModal = false;
				showAssignCredModal = true;
			}
		};
	}

	async function handleSaveAssignment() {
		await apiClient.patch('/credentials', credentialAssignmentsMap);
		await fetchCredentials();
		showAssignCredModal = false;
	}

	async function fetchCredentials() {
		loading = true;
		const { data } = await apiClient.get('/credentials');
		credentials = data;
		loading = false;
	}

	async function obtainDemoCredentials() {
		const {
			data: { uri }
		} = await apiClient.get('/oid4vc/dummy');
		qr = uri;
		obtainingDummy = true;
		const ws = createWebsocket();
		ws.onmessage = async (event) => {
			const data = JSON.parse(event.data);
			if (data.proceed) {
				fetchCredentials();
			}
		};
	}

	onMount(() => {
		fetchCredentials();
	});

	$: createAssignmentMap(credentials);
	$: console.log(credentialAssignmentsMap);
</script>

<Modal bind:open={showShareCredModal} title="Add More Credentials">
	{#if qr}
		{#if obtainingDummy}
			<p>
				Scan the QR code with an OpenID4VCI Compliant Wallet to Get Demo Credentials to have in your
				CV
			</p>

			<Qr data={qr}></Qr>

			<p>Already have credentials to share?</p>
			<Button
				on:click={() => {
					obtainingDummy = false;
					handleShareCredentials();
				}}>Share Credentials</Button
			>
		{:else}
			<p>
				Scan the QR code with an OpenID4VP Compliant Wallet to Share all credentials that you want
				to have in your CV
			</p>
			<Qr data={qr}></Qr>

			<p>Don't have any credentials to share?</p>
			<Button on:click={obtainDemoCredentials}>Obtain Demo Credentials</Button>
		{/if}
	{/if}
</Modal>

<Modal bind:open={showAssignCredModal} title="Assign Credential Types" class="max-h-[70vh]">
	<Table>
		<TableHead>
			<TableHeadCell>Credential</TableHeadCell>
			<TableHeadCell>Type</TableHeadCell>
		</TableHead>
		{#if credentials.filter((f) => f.type !== 'experience').length > 0}
			{#each credentials.filter((f) => f.type !== 'experience') as credential (credential.id)}
				<TableBodyRow>
					<TableBodyCell>{credential.name}</TableBodyCell>
					<TableBodyCell>
						<SelectInput {items} bind:value={credentialAssignmentsMap[credential.id]}></SelectInput>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		{:else}
			<TableBodyCell colspan={2}>
				<div class="flex w-full flex-col items-center gap-4 px-10 py-[22px]">
					<ExclamationCircleSolid class="h-[50px] w-[50px] text-gray-600"></ExclamationCircleSolid>
					<p>Currently you don't have any Credentials. Add Credentials first.</p>
				</div>
			</TableBodyCell>
		{/if}
	</Table>
	<div slot="footer">
		{#if credentials.filter((f) => f.type !== 'experience').length > 0}
			<Button on:click={handleSaveAssignment}>Save Assigment</Button>
		{/if}
	</div>
</Modal>

<main class="flex gap-5">
	<Card padding="lg" class="max-w-full overflow-x-hidden shadow-xl h-[calc(100vh-130px)]">
		<div class="flex items-start justify-between">
			<h1 class="text-3xl font-bold text-gray-700 mb-10">Your Credentials</h1>
			<div class="flex gap-2">
				<Button color="white" on:click={handleShowAssignmentModal}>Edit Credential Types</Button>
				<Button color="purple" on:click={handleShareCredentials}>Add Credentials</Button>
			</div>
		</div>
		{#if loading}
			<Loading></Loading>
		{:else}
			<Table divClass="w-full" striped>
				<TableHead class="text-gray-500 bg-gray-100">
					<TableHeadCell>Credential Name</TableHeadCell>
					<TableHeadCell>Credential Type</TableHeadCell>
					<TableHeadCell>Expires At</TableHeadCell>
					<TableHeadCell></TableHeadCell>
				</TableHead>
				<TableBody>
					{#if credentials.length > 0}
						{#each credentials as credential (credential.id)}
							<TableBodyRow>
								<TableBodyCell class="text-gray-600">{credential.name}</TableBodyCell>
								<TableBodyCell class="text-gray-600"
									>{credential.type
										? credential.type.charAt(0).toUpperCase() + credential.type.slice(1)
										: 'Uncategorized'}
								</TableBodyCell>
								<TableBodyCell class="text-gray-600">
									<div class="flex justify-between">
										{credential.decoded.exp
											? moment(credential.decoded.exp * 1000).format('DD MMM YYYY')
											: "Doesn't Expire"}
									</div>
								</TableBodyCell>
								<TableBodyCell class="text-gray-600">
									<div class="flex justify-between">
										<button class="text-primary-500 hover:text-primary-600">
											<DotsHorizontalOutline class="h-5 w-5 text-gray-800" />
											<Dropdown border class="py-2">
												<DropdownItem on:click={() => (selectedCredential = credential)}
													>View Credential</DropdownItem
												>
											</Dropdown>
										</button>
									</div>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					{:else}
						<TableBodyCell colspan={5}>
							<div class="flex w-full flex-col items-center gap-4 px-10 py-[22px]">
								<ExclamationCircleSolid class="h-[100px] w-[100px] text-gray-600"
								></ExclamationCircleSolid>
								<p>You don't have any Credentials yet.</p>
							</div>
						</TableBodyCell>
					{/if}
				</TableBody>
			</Table>
		{/if}
	</Card>
	<DocPreviewBar>
		<div class="flex flex-col h-full px-3 py-3 overflow-auto">
			{#if selectedCredential}
				<div class="flex items-center justify-end">
					<CloseButton on:click={() => (selectedCredential = null)} />
				</div>
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-4">
						<Avatar
							src={selectedCredential.decoded.vc.credentialSubject.enrichment
								? selectedCredential.decoded.vc.credentialSubject.enrichment.logo_uri
								: null}
							rounded
							size="lg"
							class="object-cover"
						/>
						<h1 class="text-2xl font-bold text-gray-600">
							{selectedCredential.name}
						</h1>
					</div>
					<div class="flex flex-col border-b-2 border-b-gray-300 pb-4">
						<h3 class="font-sm font-semibold text-gray-500">Issued By</h3>
						<p>{formatDid(selectedCredential.decoded.iss)}</p>
					</div>
					<div class="flex flex-col border-b-2 border-b-gray-300 pb-4">
						<h3 class="font-sm font-semibold text-gray-500">Expires</h3>
						<p>
							{selectedCredential.decoded.exp
								? moment(selectedCredential.decoded.exp).format('DD MMM YYYY')
								: "Doesn't Expire"}
						</p>
					</div>
					{#each Object.keys(selectedCredential.decoded.vc.credentialSubject).filter((k) => k !== 'enrichment') as key (key)}
						<div class="flex flex-col border-b-2 border-b-gray-300 pb-4 last:border-b-0">
							<h3 class="font-sm font-semibold text-gray-500">{key}</h3>
							<p>
								{selectedCredential.decoded.vc.credentialSubject[key]}
							</p>
						</div>
					{/each}
				</div>
			{:else}
				<h1 class="w-full text-lg py-10 text-center">Please select a credential.</h1>
			{/if}
		</div>
	</DocPreviewBar>
</main>
