<script lang="ts">
	import { apiClient } from '$lib/axios/axios';
	import Header from '$lib/components/fragments/Header.svelte';
	import Sidebar from '$lib/components/fragments/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { addToast } from '../store';
	import { goto } from '$app/navigation';

	onMount(async () => {
		const { data } = (await apiClient.get('/users').catch(() => {
			addToast({ type: 'error', message: 'Login Error' });
			goto('/login');
			return { data: null };
		})) as { data: { id: string } };
		if (!data.id) {
			goto('/login');
		}
		console.log(data);
	});
</script>

<div class="w-full">
	<div>
		<Header></Header>
	</div>
	<div class="gap-5 fixed w-full mt-[88px] lg:flex hidden">
		<div>
			<Sidebar></Sidebar>
		</div>
		<div class="w-full me-5">
			<slot></slot>
		</div>
	</div>
	<div class="flex h-screen w-screen items-center justify-center text-center lg:hidden">
		This content currently does not support your screen.
	</div>
</div>
