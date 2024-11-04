<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { Card, Modal } from 'flowbite-svelte';
	import { apiClient } from '$lib/axios/axios';
	import { addToast } from '../../../store';
	import moment from 'moment';

	let showExperienceModal = false;
	let companyUrl: string;
	let startDate: string;
	let endDate: string;
	let companyName: string;
	let jobTitle: string;
	let reference: string;

	export let experiences: Record<string, any>[] = [];
	export let cvId: string;

	async function requestExperience() {
		const { data } = await apiClient.post(`/cv/${cvId}/experience`, {
			companyUrl,
			startDate,
			endDate,
			companyName,
			jobTitle,
			reference
		});
		await fetchExperiences();
		addToast({ message: 'Experience Request has been sent' });
		showExperienceModal = false;
	}

	async function fetchExperiences() {
		const { data } = await apiClient.get(`cv/${cvId}/experience`);
		experiences = data;
	}
</script>

<Modal title="Enter Experience Details" bind:open={showExperienceModal}>
	<div class="flex flex-col gap-1">
		<Input
			label="Company Name"
			variant="text"
			bind:value={companyName}
			placeholder="Doe Systems LLC"
		></Input>
	</div>
	<div class="flex flex-col gap-1">
		<Input label="Job Title" variant="text" bind:value={jobTitle} placeholder="Software Developer"
		></Input>
	</div>
	<div class="flex flex-col gap-1">
		<Input
			label="Company URL"
			variant="text"
			bind:value={companyUrl}
			placeholder="https://doesys.com"
		></Input>
	</div>
	<div class="flex flex-col gap-1">
		<Input
			label="Reference Colleague's Email"
			variant="text"
			bind:value={reference}
			placeholder="jake@doesystems.com"
		></Input>
	</div>
	<div class="flex flex-col gap-1">
		<Input label="Start Date" variant="date" bind:value={startDate}></Input>
	</div>

	<div class="flex flex-col gap-1">
		<Input
			label="End Date (Leave Empty If Presently Working Here)"
			variant="date"
			bind:value={endDate}
		></Input>
	</div>
	<div slot="footer">
		<Button on:click={requestExperience}>Request Verified Experience</Button>
	</div>
</Modal>

<h1 class="text-2xl font-bold text-gray-700 mb-5">New VCV</h1>

<h1 class="text-lg font-semibold text-gray-600 mb-1">Request Verifiable Experience credentials</h1>
<p class="text-sm mb-5">
	A verified experience would issue you a verifiable credential which would be approved by your
	place of work. Any pending verified experience would automatically be added to your VCV once
	approved by your colleague.
</p>
<Button on:click={() => (showExperienceModal = true)} color="white"
	>Request Verified Experience</Button
>

{#if experiences.length > 0}
	<div class="flex flex-col gap-2 mt-4">
		<h1 class="text-lg font-bold">Pending Experiences</h1>
		{#each experiences as exp (exp.id)}
			<Card class="min-w-full">
				<h1 class="text-md font-bold">{exp.jobTitle}</h1>
				<h2 class="text-gray-800 font-bold text-sm">
					{exp.companyName} - {new URL(exp.companyUrl).hostname}
				</h2>
				<p class="text-gray-600 font-semibold text-sm">
					{moment(exp.startDate).format('MMM YYYY')} - {exp.endDate ?? 'Present'}
				</p>
			</Card>
		{/each}
	</div>
{/if}
