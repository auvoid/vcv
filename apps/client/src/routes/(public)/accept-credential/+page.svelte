<script lang="ts">
	import { apiClient } from '$lib/axios/axios';
	import Qr from '$lib/components/ui/Qr.svelte';
	import { Card } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let inviteData: Record<string, unknown>;
	let qrData: string;

	async function getInviteData() {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');
		const {
			data: { uri }
		} = await apiClient.get(`/oid4vc/credentials/${token}`);
		qrData = uri;
	}

	onMount(() => {
		getInviteData();
	});
</script>

<div class="just flex h-screen w-full items-center justify-center">
	<Card>
		<div class="card flex flex-col gap-5 text-center">
			<div
				class="org-data align-center flex flex-col content-center items-center justify-center gap-2"
			>
				<h2 class="text-2xl font-bold">Accept Verifiable Experience</h2>
			</div>
			{#if qrData}
				<div class="flex w-full justify-center">
					<Qr data={qrData} />
				</div>
			{/if}
			<p>To accept the Credential scan the QR with a wallet of your choice</p>
		</div>
	</Card>
</div>
