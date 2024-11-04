<script lang="ts">
	import { apiClient } from '$lib/axios/axios';
	import Loading from '$lib/components/ui/Loading.svelte';
	import Qr from '$lib/components/ui/Qr.svelte';
	import { Card } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let inviteData: Record<string, unknown>;
	let qrData: string;
	let loading = false;

	async function getInviteData() {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');
		loading = true;
		const {
			data: { uri }
		} = await apiClient.get(`/oid4vc/credentials/${token}`);
		qrData = uri;
		loading = false;
	}

	onMount(() => {
		getInviteData();
	});
</script>

<div class="just flex h-screen w-full items-center justify-center">
	<Card>
		<div class="w-full flex items-center justify-center">
			<img class="size-24" src="/images/Logo.png" alt="" />
		</div>
		<div class="card flex flex-col gap-5 text-center">
			<div class="org-data align-center flex flex-col content-center items-center justify-center">
				<h2 class="text-xl font-bold">Accept Verifiable Experience</h2>
			</div>
			{#if loading}
				<Loading></Loading>
			{:else if qrData}
				<div class="flex w-full justify-center">
					<Qr data={qrData} />
				</div>
			{/if}
			<p>To accept the Credential scan the QR with a wallet of your choice</p>
		</div>
	</Card>
</div>
