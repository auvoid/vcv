<script lang="ts">
	import { page } from '$app/stores';
	import { apiClient } from '$lib/axios/axios';
	import Button from '$lib/components/ui/Button.svelte';
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from 'flowbite-svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { addToast } from '../../store';

	let token: string;
	let exp: Record<string, any>;

	async function handleAccept(status: boolean) {
		await apiClient.post(`/cv/experience/${token}`, { approved: status });
		addToast({ message: `Experience has been ${status ? 'approved' : 'rejected'} successfully` });
	}

	onMount(async () => {
		const urlParams = new URLSearchParams($page.url.search);
		token = urlParams.get('token') as string;
		const { data } = await apiClient.get(`/cv/experience/${token}`);
		exp = data;
	});
</script>

<div class="w-full py-10 flex flex-col items-center justify-center">
	{#if exp}
		<Table>
			<TableBody>
				<TableBodyRow>
					<TableBodyCell>Full Name</TableBodyCell>
					<TableBodyCell>{exp.cv.name}</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell>Job Title</TableBodyCell>
					<TableBodyCell>{exp.jobTitle}</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell>Company Name</TableBodyCell>
					<TableBodyCell>{exp.companyName}</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell>Company Domain Name</TableBodyCell>
					<TableBodyCell>{exp.companyUrl}</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell>Start Date</TableBodyCell>
					<TableBodyCell>{moment(exp.startDate).format('DD MMM YYYY')}</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell>End Date</TableBodyCell>
					<TableBodyCell
						>{exp.endDate
							? moment(exp.endDate).format('DD MMM YYYY')
							: 'Ongoing Job'}</TableBodyCell
					>
				</TableBodyRow>
			</TableBody>
		</Table>
		<div class="flex gap-2 mt-4">
			<Button color="purple" on:click={() => handleAccept(true)}>Approve Experience</Button>
			<Button color="white" on:click={() => handleAccept(false)}>Reject Experience</Button>
		</div>
	{/if}
</div>
