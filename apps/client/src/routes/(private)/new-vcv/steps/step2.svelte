<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';

	export let intro: string;
	export let email: string;
	export let phoneNum: string;
	export let linkedin: string;
</script>

<h1 class="text-2xl font-bold text-gray-700 mb-5">New VCV</h1>
<div class="w-full flex flex-col gap-3">
	<div class="">
		<Input variant="email" label="Email" placeholder="name@example.com" bind:value={email} />
	</div>
	<div class="">
		<Input variant="phone" label="Phone Number" placeholder="9876543210" bind:value={phoneNum} />
	</div>

	<div class="">
		<Input
			variant="url"
			label="LinkedIn"
			placeholder="https://www.linkedin.com/in/ananyarana0411"
			bind:value={linkedin}
		/>
	</div>
	<div class="">
		<Input
			variant="text"
			label="Write a short introduction for this VCV"
			placeholder="My introduction"
			bind:value={intro}
		/>
	</div>
</div>
