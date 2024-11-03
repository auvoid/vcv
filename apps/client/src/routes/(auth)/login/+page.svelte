<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { goto } from '$app/navigation';
	import { apiClient } from '$lib/axios/axios';
	import { token } from '$lib/store/store';

	let email: string;
	let password: string;

	function handleLogin() {
		if (!email || !password) {
			return alert('Please fill all fields');
		} else {
			apiClient
				.post('/users/login', {
					email,
					password
				})
				.then(async (res) => {
					token.set(res.data.token);
					if (res.data.token) {
						await goto('/dashboard');
					}
				})
				.catch((err) => {
					console.log(err);
					alert(err.response.data.message);
				});
			// alert('Login Successful');
			// goto('/');
		}
	}
</script>

<div class="flex flex-col gap-3 w-full">
	<h1 class="flex self-center text-3xl text-gray-600 font-semibold">Login</h1>
	<div>
		<Input variant="email" label="Email" placeholder="example@gmail.com" bind:value={email}></Input>
	</div>
	<div>
		<Input variant="password" label="Password" placeholder="Enter Password" bind:value={password}
		></Input>
	</div>
	<div class="flex w-full gap-2">
		<Button buttonClass="w-full" color="yellow" on:click={handleLogin}>Login</Button>
		<Button buttonClass="w-full" color="white" on:click={() => goto('/')}>Cancel</Button>
	</div>
	<small class="w-full">
		<p>Don't have an account? <a class="text-brand-green" href="/sign-up">Signup</a></p>
	</small>
</div>
