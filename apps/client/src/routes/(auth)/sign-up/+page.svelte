<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/Input.svelte';
	import { Alert } from 'flowbite-svelte';
	import { apiClient } from '$lib/axios/axios';

	let email: string;
	let password: string;
	let confirmPass: string;
	let error = '';

	function handleSignup() {
		if (!email || !password) {
			return (error = 'Please fill all fields');
		} else if (password !== confirmPass) {
			return (error = 'Password does not match!');
		} else {
			apiClient
				.post('/users', {
					email,
					password
				})
				.then(async (res) => {
					console.log(res);
					if (res.status === 201) {
						await goto('/login');
					}
				})
				.catch((err) => {
					console.log(err);
					error = err.response.data.message;
				});
			return (error = '');
		}
	}
</script>

<div class="flex flex-col gap-3 w-full">
	<h1 class="flex self-center text-3xl text-gray-600 font-semibold">Signup</h1>
	{#if error}
		<Alert defaultClass="gap-3 p-1 text-sm text-center" color="red">{error}</Alert>
	{/if}
	<div>
		<Input variant="email" label="Email" placeholder="example@gmail.com" bind:value={email}></Input>
	</div>
	<div>
		<Input variant="password" label="Password" placeholder="Enter Password" bind:value={password}
		></Input>
	</div>
	<div>
		<Input
			variant="password"
			label="Confirm Password"
			placeholder="Confirm Password"
			bind:value={confirmPass}
		></Input>
	</div>
	<div class="flex w-full gap-2">
		<Button buttonClass="w-full" color="yellow" on:click={handleSignup}>Signup</Button>
		<Button buttonClass="w-full" color="white" on:click={() => goto('/')}>Cancel</Button>
	</div>
	<small class="w-full">
		<p>Already have an account? <a class="text-brand-green" href="/login">Login</a></p>
	</small>
</div>
