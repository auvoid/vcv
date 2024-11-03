<script lang="ts">
	import { Card, Hr, Li, Tooltip, Avatar } from 'flowbite-svelte';
	import {
		EnvelopeSolid,
		PhoneSolid,
		GithubSolid,
		LinkedinSolid,
		QrCodeOutline,
		CheckCircleSolid,
		ExclamationCircleSolid,
		CloseCircleSolid,
		ChevronLeftOutline
	} from 'flowbite-svelte-icons';
	import Step1 from './steps/step1.svelte';
	import Step2 from './steps/step2.svelte';
	import Step3 from './steps/step3.svelte';
	import Step4 from './steps/step4.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { goto } from '$app/navigation';
	import { apiClient } from '$lib/axios/axios';
	import { formatDid } from '$lib/util/did';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { addToast } from '../../store';
	import CvPreview from '$lib/components/fragments/CvPreview.svelte';

	let step = 0;
	let vcvName: string;
	let name: string;
	let role: string;
	let intro: string;
	let email: string;
	let phoneNum: string;
	let github: string;
	let linkedin: string;
	let skills: string[];
	let credentials: Record<string, any>[] = [];
	let experiences: Record<string, any>[] = [];
	let editing = false;
	let cvId: string;

	function handleGoBack() {
		if (step === 0) {
			goto('/dashboard');
		} else {
			step--;
		}
	}

	async function handleContinue() {
		console.log(step);
		if (step === 2) {
			const payload = {
				name,
				cvName: vcvName,
				title: role,
				bio: intro,
				contacts: { linkedin, email, phone: phoneNum },
				credentials: credentials.map((c) => c.id)
			};
			if (editing) {
				await apiClient.patch(`/cv/${cvId}`, payload);
			} else {
				const { data } = await apiClient.post('/cv', payload);
				cvId = data.id;
			}
			step++;
		} else if (step === 3) {
			addToast({ message: `your CV ${vcvName} has been saved` });
			goto('/dashboard');
		} else {
			step++;
		}
	}

	onMount(async () => {
		const urlParams = new URLSearchParams($page.url.search);
		const urlContainerId = urlParams.get('id');
		if (urlContainerId) {
			cvId = urlContainerId;
			editing = true;
			const { data } = await apiClient.get(`/cv/${urlContainerId}`);
			name = data.name;
			vcvName = data.cvName;
			role = data.title;
			intro = data.bio;
			linkedin = data.contacts.linkedin;
			email = data.contacts.email;
			phoneNum = data.contacts.phone;
			credentials = data.credentials;
			experiences = data.experiences;
		}
	});
</script>

<main class="flex gap-5 min-w-full">
	<Card padding="lg" class="max-w-[40%] overflow-x-hidden shadow-xl h-[calc(100vh-130px)]">
		<div class="flex flex-col gap-20">
			<div>
				{#if step === 0}
					<Step1 bind:vcvName bind:name bind:role></Step1>
				{:else if step === 1}
					<Step2 bind:intro bind:email bind:phoneNum bind:linkedin></Step2>
				{:else if step === 2}
					<Step3 bind:selectedCredentials={credentials}></Step3>
				{:else if step === 3}
					<Step4 {cvId} bind:experiences></Step4>
				{/if}
			</div>
			<div class="flex w-full justify-between items-center">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="flex w-full cursor-pointer text-sm" on:click={handleGoBack}>
					<ChevronLeftOutline></ChevronLeftOutline>Go Back
				</div>
				<div class="w-full flex justify-end">
					<Button color="yellow" on:click={handleContinue}>Continue</Button>
				</div>
			</div>
		</div>
	</Card>
	<Card padding="lg" class="max-w-[60%] overflow-x-hidden shadow-xl h-[calc(100vh-130px)]">
		<div class="flex flex-col max-w-full gap-4 items-start">
			<h1 class="font-bold text-gray-950 text-md">{vcvName ?? 'My VCV'}</h1>
			<CvPreview {name} {intro} {credentials} {role} {phoneNum} {email} {linkedin} {cvId}
			></CvPreview>
		</div>
	</Card>
</main>
