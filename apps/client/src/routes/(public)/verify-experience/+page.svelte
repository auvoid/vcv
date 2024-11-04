<script lang="ts">
	import { page } from '$app/stores';
	import { apiClient } from '$lib/axios/axios';
	import Button from '$lib/components/ui/Button.svelte';
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from 'flowbite-svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { addToast } from '../../store';
	import Loading from '$lib/components/ui/Loading.svelte';
	import Logo from '$lib/components/ui/Logo.svelte';

	let token: string;
	let exp: Record<string, any>;
	let loading = false;
	let approvalStatus: string | null = null;

	async function handleAccept(status: boolean) {
		await apiClient.post(`/cv/experience/${token}`, { approved: status });
		approvalStatus = status ? 'approved' : 'rejected';
		addToast({ message: `Experience has been ${approvalStatus} successfully` });
	}

	onMount(async () => {
		const urlParams = new URLSearchParams($page.url.search);
		token = urlParams.get('token') as string;
		loading = true;
		const { data } = await apiClient.get(`/cv/experience/${token}`);
		exp = data;
		loading = false;
	});
</script>

<div class="w-full flex items-center justify-center">
	<img class="size-48" src="/images/Logo.png" alt="" />
</div>
{#if loading}
	<Loading></Loading>
{:else}
	<div class="w-full py-10 flex flex-col items-center justify-center">
		{#if exp}
			{#if approvalStatus}
				<div class="mt-4 text-lg font-bold">
					Experience has been {approvalStatus}!
				</div>
			{:else}
				<h1 class="text-md font-semibold mb-4">
					Please check the following details and verify the experience.
				</h1>
				<Table border={2}>
					<TableBody>
						<TableBodyRow>
							<TableBodyCell class="font-bold">Full Name</TableBodyCell>
							<TableBodyCell>{exp.cv.name}</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow>
							<TableBodyCell class="font-bold">Job Title</TableBodyCell>
							<TableBodyCell>{exp.jobTitle}</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow>
							<TableBodyCell class="font-bold">Company Name</TableBodyCell>
							<TableBodyCell>{exp.companyName}</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow>
							<TableBodyCell class="font-bold">Company Domain Name</TableBodyCell>
							<TableBodyCell>{exp.companyUrl}</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow>
							<TableBodyCell class="font-bold">Start Date</TableBodyCell>
							<TableBodyCell>{moment(exp.startDate).format('DD MMM YYYY')}</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow>
							<TableBodyCell class="font-bold">End Date</TableBodyCell>
							<TableBodyCell>
								{exp.endDate ? moment(exp.endDate).format('DD MMM YYYY') : 'Ongoing Job'}
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				</Table>
				<div class="flex gap-2 mt-4">
					<Button color="purple" on:click={() => handleAccept(true)}>Approve Experience</Button>
					<Button color="white" on:click={() => handleAccept(false)}>Reject Experience</Button>
				</div>
			{/if}
		{/if}
	</div>
{/if}
