<script lang="ts">
	import { page } from '$app/stores';
	import { token } from '$lib/store/store';
	import { Avatar, Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import {
		ChartPieSolid,
		InboxFullSolid,
		BookSolid,
		UserSettingsSolid,
		ArrowRightToBracketOutline,
		FileLinesSolid
	} from 'flowbite-svelte-icons';

	$: activeUrl = $page.url.pathname;

	const handleLogout = async () => {
		token.update(() => '');
		window.location.pathname = '/login';
	};
</script>

<Sidebar {activeUrl}>
	<SidebarWrapper
		class="shadow-xl h-[calc(100vh-130px)] rounded-l-none w-64 bg-white border flex flex-col justify-between"
	>
		<div>
			<SidebarGroup>
				<div class="flex flex-col gap-6 mb-3">
					<div class="flex items-center gap-3">
						<Avatar rounded class="object-cover" src="" />
						<h2 class="text-lg font-semibold">Welcome!</h2>
					</div>
				</div>
				<SidebarItem href="/dashboard" active={activeUrl === '/dashboard'} label="Your VCVs">
					<svelte:fragment slot="icon">
						<ChartPieSolid
							class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					href="/credentials"
					active={activeUrl === '/credentials'}
					label="Your Credentials"
				>
					<svelte:fragment slot="icon">
						<FileLinesSolid
							class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem class="future-disabled" label="Notification">
					<svelte:fragment slot="icon">
						<InboxFullSolid
							class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
						/>
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="text-red-700 ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-200 p-3 text-sm font-medium"
						>
							1
						</span>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</div>
		<div>
			<SidebarGroup border>
				<SidebarItem class="future-disabled" label="Docs">
					<svelte:fragment slot="icon">
						<BookSolid
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem class="future-disabled" label="Settings">
					<svelte:fragment slot="icon">
						<UserSettingsSolid
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem on:click={handleLogout} label="Logout">
					<svelte:fragment slot="icon">
						<ArrowRightToBracketOutline
							strokeWidth={2.5}
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</div>
	</SidebarWrapper>
</Sidebar>
