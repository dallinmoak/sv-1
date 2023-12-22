<script>
	import { format } from 'date-fns';
	import TableCell from './TableCell.svelte';
	export let data;
	export let transit;
	let contentList = [
		{
			value: format(new Date(transit.date), "yyyy-MM-dd'T'HH:mm"),
			display: (v) => format(new Date(transit.date), 'eee LLL do'),
			type: 'datetime-local'
		},
		{
			value: transit.driver,
			display: (v) => v,
			type: 'text'
		},
		{
			value: transit.car,
			display: (v) => v,
			type: 'text'
		},
		{
			value: transit.custom_distance ? transit.custom_distance : data.userSettings.distance,
			display: (v) => `${v} miles`,
			type: 'text'
		}
	];

	let editing = false;
  const handleSave = ()=> {
    editing = false;
  }
</script>

<tr>
	{#each contentList as content}
		<TableCell contents={content} {editing} />
	{/each}
	{#if editing}
		<td><button on:click={handleSave}>save</button></td>
		<td><button on:click={() => (editing = false)}>cancel</button></td>
	{:else}
		<td><button on:click={() => (editing = true)}>edit</button></td>
		<td><button>delete</button></td>
	{/if}
</tr>
