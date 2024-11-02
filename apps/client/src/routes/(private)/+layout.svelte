<script lang="ts">
	import Header from '$lib/components/fragments/Header.svelte';
	import Sidebar from '$lib/components/fragments/Sidebar.svelte';
</script>

<div class="w-full">
	<div>
		<Header></Header>
	</div>
	<div class="flex gap-5 fixed w-full mt-[88px]">
		<div>
			<Sidebar></Sidebar>
		</div>
		<div class="w-full me-5">
			<slot></slot>
		</div>
	</div>
</div>
