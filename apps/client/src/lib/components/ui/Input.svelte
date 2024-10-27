<script lang="ts">
	import { Helper, Input, Label, Textarea } from 'flowbite-svelte';
	import Radio from './Radio.svelte';

	export let variant:
		| 'text'
		| 'email'
		| 'password'
		| 'date'
		| 'number'
		| 'textarea'
		| 'phone'
		| 'datetime'
		| 'url'
		| 'boolean' = 'text';
	export let label: string = '';
	export let placeholder: string = '';
	export let disabled: boolean = false;
	export let helperText: string = '';
	export let value: string;
	export let classExtras: string = '';

	let inputClass = `focus:border-brand-green focus:ring-brand-green bg-gray-200 ` + classExtras;
</script>

<div class="flex gap-1">
	<Label for="input" class="text-font-bold text-md mb-1">
		{label}
	</Label>
</div>

{#if variant === 'textarea'}
	<Textarea bind:value id="input" rows={6} {placeholder} {disabled} unWrappedClass={inputClass} />
{:else if variant === 'boolean'}
	<div class="flex w-full flex-col gap-2">
		<Radio value="yes" bind:group={value} label="yes"></Radio>
		<Radio value="no" bind:group={value} label="no"></Radio>
	</div>
{:else}
	<Input
		bind:value
		type={variant === 'phone' ? 'tel' : variant === 'datetime' ? 'datetime-local' : variant}
		{placeholder}
		id="input"
		class={inputClass}
	/>
{/if}

{#if helperText}
	<Helper class="ms-1 text-gray-500 {variant === 'textarea' ? '' : 'mt-1'}">{helperText}</Helper>
{/if}
