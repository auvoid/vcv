<script lang="ts">
	import { Search } from 'flowbite-svelte';
	import Button from '../ui/Button.svelte';
	import Logo from '../ui/Logo.svelte';
	import { goto } from '$app/navigation';
</script>

<header
	class="fixed z-[10] flex h-16 w-screen justify-between items-center border-b-[1px] gap-3 border-gray-200 bg-white p-2 pl-3 shadow-lg border px-5"
>
	<div class="flex gap-2 items-center">
		<Logo></Logo>
		<h1 class="text-2xl font-semibold select-none text-gray-700">VCV</h1>
	</div>
	<div class="w-2/5">
		<Search
			disabled
			class="w-full text-ellipsis rounded-lg py-[12px] focus:border-brand-green focus:ring-brand-green"
			size="md"
		></Search>
	</div>
	<div>
		<Button color="purple" on on:click={() => goto('/new-vcv')}>Create New VCV</Button>
	</div>
</header>
