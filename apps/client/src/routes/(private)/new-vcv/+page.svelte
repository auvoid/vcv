<script lang="ts">
	import { Card, Hr, Li, Tooltip } from 'flowbite-svelte';
	import {
		EnvelopeSolid,
		PhoneSolid,
		GithubSolid,
		LinkedinSolid,
		QrCodeOutline,
		CheckCircleSolid,
		ExclamationCircleSolid,
		CloseCircleSolid
	} from 'flowbite-svelte-icons';
	import Step1 from './steps/step1.svelte';
	import Step2 from './steps/step2.svelte';

	let step = 0;
	let vcvName: string;
	let name: string;
	let intro: string;
	let email: string;
	let phoneNum: number;
	let github: string;
	let linkedin: string;
</script>

<main class="flex gap-5 min-w-full">
	<Card padding="lg" class="max-w-full overflow-x-hidden shadow-xl h-[calc(100vh-130px)]">
		{#if step === 0}
			<Step1 bind:vcvName bind:name bind:intro bind:email bind:phoneNum bind:github bind:linkedin
			></Step1>
		{:else if step === 1}
			<Step2></Step2>
		{/if}
	</Card>
	<Card padding="lg" class="max-w-full overflow-x-hidden shadow-xl h-[calc(100vh-130px) ">
		<div class="mb-5">
			<h1 class="font-bold text-2xl">Preview</h1>
		</div>
		<div class="flex flex-col h-full max-w-full gap-4 items-center">
			<div class="flex flex-col items-start">
				<h1 class="font-bold text-gray-950 text-md">{vcvName ?? 'My VCV'}</h1>
				<div class="aspect-[1/1.414] flex">
					<div
						class="w-[30%] h-full bg-cyan-900 py-10 px-4 flex flex-col justify-between items-center"
					>
						<div>
							<div>
								<h1 class="font-semibold text-lg text-gray-50 mb-1">Contact</h1>
								<div class="flex flex-col gap-[3px]">
									<div class="text-xs font-medium text-gray-300">
										<div class="flex items-center gap-1">
											<EnvelopeSolid></EnvelopeSolid>{email}
										</div>
										<div class="flex items-center gap-1">
											<PhoneSolid></PhoneSolid>{phoneNum}
										</div>
										<div class="flex items-center gap-1">
											<GithubSolid></GithubSolid>{github}
										</div>
										<div class="flex items-center gap-1">
											<LinkedinSolid></LinkedinSolid>{linkedin}
										</div>
									</div>
								</div>
							</div>
							<Hr hrClass="h-px my-4 bg-gray-500 border-0" />
							<h1 class="font-semibold text-lg text-gray-50 mb-1">About</h1>
							<div class="text-xs text-gray-200">
								{intro}
							</div>
							<Hr hrClass="h-px my-4 bg-gray-500 border-0" />

							<div>
								<h1 class="font-semibold text-lg text-gray-50 mb-1">Skills</h1>
								<div class="flex flex-col gap-[3px]">
									<h1 class="text-xs font-medium text-gray-300"><Li>Cry</Li></h1>
									<h1 class="text-xs font-medium text-gray-300"><Li>Cry</Li></h1>
									<h1 class="text-xs font-medium text-gray-300"><Li>Cry</Li></h1>
								</div>
							</div>
						</div>
						<div class="flex flex-col items-center justify-center">
							<QrCodeOutline class="h-32 w-32"></QrCodeOutline>
							<h1 class="text-[10px] font-medium text-gray-200">Scan the QR to Verify this CV</h1>
						</div>
					</div>
					<div class="w-[70%] h-full bg-gray-100 p-10">
						<h1 class="text-3xl font-bold text-gray-800">{name}</h1>
						<h1 class="text-sm font-medium text-gray-500">Role you are applying for...</h1>
						<Hr hrClass="h-px my-3 bg-gray-300 border-0" />
						<div>
							<h1 class="font-semibold text-lg text-gray-700">Education</h1>
							<div class="flex flex-col gap-2">
								<Card padding="xs" shadow={false} border={false} class="max-w-full">
									<div class="flex items-center gap-2">
										<CheckCircleSolid class="text-brand-green"></CheckCircleSolid>
										<Tooltip type="light"><p class="text-xs">Verified by VCV</p></Tooltip>
										<div class="flex gap-3">
											<div class="flex flex-col">
												<h3 class="text-md font-semibold text-gray-700">BTech</h3>
												<p class="text-xs">Panjab University</p>
												<p class="text-xs">Aug 2021 - Aug 2025</p>
											</div>
										</div>
									</div>
								</Card>
								<Card padding="xs" shadow={false} border={false} class="max-w-full">
									<div class="flex gap-2 items-center">
										<ExclamationCircleSolid class="text-brand-yellow"></ExclamationCircleSolid>
										<Tooltip type="light"><p class="text-xs">Verification Pending</p></Tooltip>
										<div class="flex gap-3">
											<div class="flex flex-col">
												<h3 class="text-md font-semibold text-gray-700">10+2</h3>
												<p class="text-xs">Some Shitty School</p>
												<p class="text-xs">Aug 2020 - Aug 2021</p>
											</div>
										</div>
									</div>
								</Card>
							</div>
						</div>
						<Hr hrClass="h-px my-3 bg-gray-300 border-0 dark:bg-gray-700" />
						<div>
							<h1 class="font-semibold text-lg text-gray-700">Experience</h1>
							<div class="flex flex-col gap-2">
								<Card padding="xs" shadow={false} border={false} class="max-w-full">
									<div class="flex gap-2 items-center">
										<CloseCircleSolid class="text-red-400"></CloseCircleSolid>
										<Tooltip type="light"><p class="text-xs">Verification Failed</p></Tooltip>
										<div class="flex gap-3">
											<div class="flex flex-col">
												<h3 class="text-md font-semibold text-gray-700">Internship in some role</h3>
												<p class="text-xs">Amazing Company</p>
												<p class="text-xs">Apr 2023 - Sep 2023</p>
											</div>
										</div>
									</div>
								</Card>
								<Card padding="xs" shadow={false} border={false} class="max-w-full">
									<div class="flex gap-2 items-center">
										<CloseCircleSolid class="text-red-400"></CloseCircleSolid>
										<Tooltip type="light"><p class="text-xs">Verification Failed</p></Tooltip>
										<div class="flex gap-3">
											<div class="flex flex-col">
												<h3 class="text-md font-semibold text-gray-700">Internship in some role</h3>
												<p class="text-xs">Amazing Company</p>
												<p class="text-xs">Apr 2023 - Sep 2023</p>
											</div>
										</div>
									</div>
								</Card>
								<Card padding="xs" shadow={false} border={false} class="max-w-full">
									<div class="flex gap-2 items-center">
										<CloseCircleSolid class="text-red-400"></CloseCircleSolid>
										<Tooltip type="light"><p class="text-xs">Verification Failed</p></Tooltip>
										<div class="flex gap-3">
											<div class="flex flex-col">
												<h3 class="text-md font-semibold text-gray-700">Internship in some role</h3>
												<p class="text-xs">Amazing Company</p>
												<p class="text-xs">Apr 2023 - Sep 2023</p>
											</div>
										</div>
									</div>
								</Card>
								<Card padding="xs" shadow={false} border={false} class="max-w-full">
									<div class="flex gap-2 items-center">
										<CloseCircleSolid class="text-red-400"></CloseCircleSolid>
										<Tooltip type="light"><p class="text-xs">Verification Failed</p></Tooltip>
										<div class="flex gap-3">
											<div class="flex flex-col">
												<h3 class="text-md font-semibold text-gray-700">Internship in some role</h3>
												<p class="text-xs">Amazing Company</p>
												<p class="text-xs">Apr 2023 - Sep 2023</p>
											</div>
										</div>
									</div>
								</Card>
								<Card padding="xs" shadow={false} border={false} class="max-w-full">
									<div class="flex gap-2 items-center">
										<CloseCircleSolid class="text-red-400"></CloseCircleSolid>
										<Tooltip type="light"><p class="text-xs">Verification Failed</p></Tooltip>
										<div class="flex gap-3">
											<div class="flex flex-col">
												<h3 class="text-md font-semibold text-gray-700">Internship in some role</h3>
												<p class="text-xs">Amazing Company</p>
												<p class="text-xs">Apr 2023 - Sep 2023</p>
											</div>
										</div>
									</div>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card>
</main>
