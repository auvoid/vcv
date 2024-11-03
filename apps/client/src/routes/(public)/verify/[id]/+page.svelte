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

<div class="px-10 py-10 flex gap-2">
	<Card class="min-w-[50%]">
		<div class="py-10 px-10">
			<BadgeCheckSolid size="xl"></BadgeCheckSolid>
			<h1 class="text-3xl font-bold mt-2 text-gray-900">This CV is Valid!</h1>

			<div class="flex flex-col gap-2 mt-5">
				<p>
					This CV has been generated using VCV, VCV uses verifiable credentials, so all claims
					present on this CV about experience, certifications and education have been digitally
					signed
				</p>

				<p>
					All experiences have been signed by a colleague of the user using their company issued
					email
				</p>
			</div>
		</div>
	</Card>
	<Card class="min-w-[50%]">
		{#if cv}
			<CvPreview
				name={cv.name}
				credentials={cv.credentials}
				role={cv.jobTitle}
				intro={cv.bio}
				linkedin={cv.contacts.linkedin}
				phoneNum={cv.contacts.phone}
				email={cv.contacts.email}
			></CvPreview>
		{/if}
	</Card>
</div>
