<script lang="ts">
	import { qrcode } from 'svelte-qrcode-action';

	export let data: string;

	let options = {
		width: 250,
		height: 250,
		backgroundOptions: {
			color: '#ffffff',
			borderRadius: '30px'
		},
		dotOptions: {
			color: '#3d3d3d'
		}
	};
</script>

<div class="w-fit overflow-hidden rounded-lg" use:qrcode={{ ...options, data }} />
