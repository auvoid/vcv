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
		if (step < 3) return step++;
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
			const cvId = data.id;
		}
		addToast({ message: `Your VCV "${name}" Saved Successfully` });
		goto('/dashboard');
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
			<div class="flex flex-col items-center self-center">
				<div class="aspect-[1/1.414] min-w-[595px] flex">
					<div
						class="w-[30%] h-full bg-cyan-900 py-10 px-4 flex flex-col justify-between items-center"
					>
						<div>
							<div>
								<h1 class="font-semibold text-lg text-gray-50 mb-1">Contact</h1>
								<div class="flex flex-col gap-[3px]">
									<div class="text-xs font-medium text-gray-300">
										{#if email}
											<div class="flex items-center gap-1">
												<EnvelopeSolid></EnvelopeSolid>{email}
											</div>
										{/if}
										{#if phoneNum}
											<div class="flex items-center gap-1">
												<PhoneSolid></PhoneSolid>{phoneNum}
											</div>
										{/if}
										{#if github}
											<div class="flex items-center gap-1">
												<GithubSolid></GithubSolid>{github}
											</div>
										{/if}
										{#if linkedin}
											<div class="flex items-center gap-1">
												<LinkedinSolid></LinkedinSolid>{linkedin}
											</div>
										{/if}
									</div>
								</div>
							</div>
							<Hr hrClass="h-px my-4 bg-gray-500 border-0" />
							<h1 class="font-semibold text-lg text-gray-50 mb-1">About</h1>
							<div class="text-xs text-gray-200">
								{intro}
							</div>
						</div>
						<div class="flex flex-col items-center justify-center">
							<QrCodeOutline class="h-32 w-32"></QrCodeOutline>
							<h1 class="text-[10px] font-medium text-gray-200">Scan the QR to Verify this CV</h1>
						</div>
					</div>
					<div class="w-[70%] h-full bg-gray-100 p-10">
						<h1 class="text-3xl font-bold text-gray-800">{name ?? 'Your Name'}</h1>
						<h1 class="text-sm font-medium text-gray-500">{role ?? 'Backend Developer'}</h1>
						<div class="pb-4"></div>
						<div>
							{#if credentials.filter((c) => c.type === 'experience').length > 0}
								<h1 class="font-semibold text-lg text-gray-700">Experiences</h1>
								<div class="flex flex-col gap-2">
									{#each credentials.filter((c) => c.type === 'experience') as credential (credential.id)}
										<Card padding="xs" shadow={false} border={false} class="max-w-full">
											<div class="flex items-center gap-2">
												<Avatar
													src={credential.decoded.vc.credentialSubject.enrichment
														? credential.decoded.vc.credentialSubject.enrichment.logo_uri
														: null}
													rounded
													size="md"
													class="object-cover"
												/>
												<div class="flex gap-3">
													<div class="flex flex-col">
														<h3 class="text-sm font-semibold text-gray-700">{credential.name}</h3>
														<p class="text-xs">{formatDid(credential.decoded.iss)}</p>
														<p class="text-xs">
															Issued at: {moment(
																(credential.decoded.nbf ?? credential.createdAt) * 1000
															).format('DD MMM YYYY')}
														</p>
													</div>
												</div>
											</div>
										</Card>
									{/each}
								</div>
							{/if}
						</div>
						<div>
							{#if credentials.filter((c) => c.type === 'education').length > 0}
								<Hr hrClass="h-px my-3 bg-gray-300 border-0 dark:bg-gray-700" />
								<h1 class="font-semibold text-lg text-gray-700">Education</h1>
								<div class="flex flex-col gap-2">
									{#each credentials.filter((c) => c.type === 'education') as credential (credential.id)}
										<Card padding="xs" shadow={false} border={false} class="max-w-full">
											<div class="flex items-center gap-2">
												<Avatar
													src={credential.decoded.vc.credentialSubject.enrichment
														? credential.decoded.vc.credentialSubject.enrichment.logo_uri
														: null}
													rounded
													size="md"
													class="object-cover"
												/>
												<div class="flex gap-3">
													<div class="flex flex-col">
														<h3 class="text-sm font-semibold text-gray-700">{credential.name}</h3>
														<p class="text-xs">{formatDid(credential.decoded.iss)}</p>
														<p class="text-xs">
															Issued at: {moment(
																(credential.decoded.nbf ?? credential.createdAt) * 1000
															).format('DD MMM YYYY')}
														</p>
													</div>
												</div>
											</div>
										</Card>
									{/each}
								</div>
							{/if}
						</div>
						<div>
							{#if credentials.filter((c) => c.type === 'certification').length > 0}
								<Hr hrClass="h-px my-3 bg-gray-300 border-0 dark:bg-gray-700" />
								<h1 class="font-semibold text-lg text-gray-700">Certifications</h1>
								<div class="flex flex-col gap-2">
									{#each credentials.filter((c) => c.type === 'certification') as credential (credential.id)}
										<Card padding="xs" shadow={false} border={false} class="max-w-full">
											<div class="flex items-center gap-2">
												<Avatar
													src={credential.decoded.vc.credentialSubject.enrichment
														? credential.decoded.vc.credentialSubject.enrichment.logo_uri
														: null}
													rounded
													size="md"
													class="object-cover"
												/>
												<div class="flex gap-3">
													<div class="flex flex-col">
														<h3 class="text-sm font-semibold text-gray-700">{credential.name}</h3>
														<p class="text-xs">{formatDid(credential.decoded.iss)}</p>
														<p class="text-xs">
															Issued at: {moment(
																(credential.decoded.nbf ?? credential.createdAt) * 1000
															).format('DD MMM YYYY')}
														</p>
													</div>
												</div>
											</div>
										</Card>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card>
</main>
