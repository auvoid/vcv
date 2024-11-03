<script lang="ts">
	import { formatDid } from '$lib/util/did';
	import { Avatar, Card, Hr } from 'flowbite-svelte';
	import { EnvelopeSolid, LinkedinSolid, PhoneSolid, QrCodeOutline } from 'flowbite-svelte-icons';
	import { PUBLIC_CLIENT_URI } from '$env/static/public';
	import moment from 'moment';
	import Qr from '../ui/Qr.svelte';

	export let email: string;
	export let phoneNum: string;
	export let name: string;
	export let credentials: Record<string, any>[];
	export let linkedin: string;
	export let intro: string;
	export let role: string;
	export let cvId: string;

	$: cvUrl = new URL(`/verify/cvId`, PUBLIC_CLIENT_URI).toString();
</script>

<div class="flex flex-col items-center self-center">
	<div class="aspect-[1/1.414] min-w-[595px] flex">
		<div class="w-[30%] h-full bg-cyan-900 py-10 px-4 flex flex-col justify-between items-center">
			<div>
				{#if email || phoneNum || linkedin}
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

								{#if linkedin}
									<div class="flex items-center gap-1">
										<LinkedinSolid></LinkedinSolid>{linkedin}
									</div>
								{/if}
							</div>
						</div>
					</div>
					<Hr hrClass="h-px my-4 bg-gray-500 border-0" />
				{/if}
				<h1 class="font-semibold text-lg text-gray-50 mb-1">About</h1>
				<div class="text-xs text-gray-200">
					{intro}
				</div>
			</div>
			<div class="flex flex-col items-center justify-center">
				{#if cvId}
					<Qr size={120} data={cvUrl}></Qr>
					<h1 class="text-[10px] font-medium mt-2 text-gray-200">Scan the QR to Verify this CV</h1>
				{/if}
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
									<div class="flex gap-3">
										<div class="flex flex-col">
											<h3 class="text-sm font-semibold text-gray-700">
												{credential.decoded.vc.credentialSubject['Company Name']} - {new URL(
													credential.decoded.vc.credentialSubject['Company Website']
												).host}
											</h3>
											<p class="text-sm font-bold">
												{credential.decoded.vc.credentialSubject['Job Title']}
											</p>
											<p class="text-xs">
												{moment(credential.decoded.vc.credentialSubject['Start Date']).format(
													'MMM YYYY'
												)} - {credential.decoded.vc.credentialSubject['End Date'] !== 'Present'
													? moment(
															credential.decoded.vc.credentialSubject['End Date'].format('MMM YYYY')
														)
													: 'Present'}
											</p>
											<p class="text-xs">
												Verified By: {credential.decoded.vc.credentialSubject['Verified By']}
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
