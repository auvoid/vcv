<script lang="ts">
	import { apiClient } from '$lib/axios/axios';
	import Button from '$lib/components/ui/Button.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import Loading from '$lib/components/ui/Loading.svelte';
	import { formatDid } from '$lib/util/did';
	import { Avatar, Card, Modal, Tooltip, Badge } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let showCredModal: boolean = false;
	let credentials: Record<string, any>[];
	let cred: Record<string, any>;
	let loading = false;
	export let selectedCredentials: Record<string, any>[] = [];

	onMount(async () => {
		loading = true;
		const { data } = await apiClient.get('/credentials');
		credentials = data;
		loading = false;
	});

	function handleCheckCredential(cred: Record<string, any>) {
		if (selectedCredentials.find((c) => c.id === cred.id)) {
			selectedCredentials = selectedCredentials.filter((c) => c.id !== cred.id);
		} else {
			selectedCredentials = [...selectedCredentials, cred];
		}
		console.log(selectedCredentials);
	}
</script>

<h1 class="text-2xl font-bold text-gray-700 mb-5">New VCV</h1>

<h1 class="text-lg font-semibold text-gray-600 mb-5">
	Select the credentials to be displayed on your VCV
</h1>

{#if loading}
	<Loading></Loading>
{:else}
	<div class="flex flex-col gap-3">
		{#if credentials.length > 0}
			{#each credentials as credential (credential.id)}
				<div class="flex gap-5">
					<Checkbox
						checked={selectedCredentials.map((e) => e.id).includes(credential.id)}
						on:click={() => handleCheckCredential(credential)}
					></Checkbox>
					<Card padding="xs">
						<div class="flex gap-5 justify-between items-center">
							<div class="flex gap-3">
								<Avatar
									src={credential.decoded.vc.credentialSubject.enrichment
										? credential.decoded.vc.credentialSubject.enrichment.logo_uri
										: null}
									rounded
									size="md"
									class="object-cover"
								/>
								<div class="flex flex-col items-start border-b-gray-300">
									<h3 class="text-md font-semibold text-gray-500">{credential.name}</h3>
									<Badge
										color={credential.type === 'experience'
											? 'green'
											: credential.type === 'education'
												? 'yellow'
												: 'blue'}>{credential.type}</Badge
									>
									<p class="text-sm">{formatDid(credential.decoded.iss)}</p>
								</div>
							</div>
							<div>
								<Button
									color="white"
									on:click={() => {
										showCredModal = true;
										cred = credential;
									}}>View</Button
								>
							</div>
						</div>
					</Card>
				</div>
			{/each}
		{:else}
			<h1>You don't have any credentials :(</h1>
		{/if}
	</div>
{/if}

<Modal title="View Credential" bind:open={showCredModal}>
	<div class="flex flex-col gap-4">
		<div class="flex gap-4 items-center">
			<Avatar
				rounded
				size="lg"
				class="object-cover"
				src={cred.decoded.vc.credentialSubject.enrichment
					? cred.decoded.vc.credentialSubject.enrichment.logo_uri
					: null}
			/>
			<div>
				<h1 class="text-2xl font-bold text-gray-600 flex items-center gap-2">{cred.name}</h1>
				<p>Issued by: <spam class="font-semibold">{formatDid(cred.decoded.iss)}</spam></p>
			</div>
		</div>
		{#each Object.keys(cred.decoded.vc.credentialSubject).filter((k) => k !== 'enrichment') as key (key)}
			<div class="flex flex-col">
				<h3 class="font-sm font-semibold text-gray-500">{key}</h3>
				<p>
					{cred.decoded.vc.credentialSubject[key]}
				</p>
			</div>
		{/each}
	</div>
</Modal>
