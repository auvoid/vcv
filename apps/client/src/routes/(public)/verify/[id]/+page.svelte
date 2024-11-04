<script lang="ts">
	import { page } from '$app/stores';
	import { apiClient } from '$lib/axios/axios';
	import CvPreview from '$lib/components/fragments/CvPreview.svelte';
	import { Card } from 'flowbite-svelte';
	import { BadgeCheckSolid, CheckCircleSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	let cv: Record<string, any>;

	onMount(async () => {
		const { id } = $page.params;
		const { data } = await apiClient.get(`cv/${id}`);
		cv = data;
	});
</script>

<div class="px-5 py-5 flex gap-5">
	<Card class="w-full">
		<div class="flex flex-col items-center w-full">
			<div class="w-full flex items-center justify-center">
				<img class="size-48" src="/images/Logo.png" alt="" />
			</div>
			<div class=" px-5 w-full">
				<div class="flex items-center w-full justify-center">
					<BadgeCheckSolid color="#9187cd" size="lg"></BadgeCheckSolid>
					<h1 class="text-xl font-semibold text-gray-900">This CV has been Verified!</h1>
				</div>
				<div class="flex flex-col gap-2 mt-5">
					<p>
						This CV has been generated using VCV. VCV uses verifiable credentials, so all claims
						present on this CV about experience, certifications and education have been digitally
						signed.
					</p>
					<p>
						All experiences have been signed by a colleague of the user using their company issued
						email.
					</p>
				</div>
			</div>
		</div>
	</Card>
	{#if cv}
		<Card class="min-w-[50%]">
			<CvPreview
				name={cv.name}
				credentials={cv.credentials}
				role={cv.jobTitle}
				intro={cv.bio}
				linkedin={cv.contacts.linkedin}
				phoneNum={cv.contacts.phone}
				email={cv.contacts.email}
				cvId={cv.id}
			></CvPreview>
		</Card>
	{/if}
</div>
