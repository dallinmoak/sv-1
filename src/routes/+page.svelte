<script>
	import { transits } from './stores';
	export let data;
	import { onMount } from 'svelte';
	import { format } from 'date-fns';

	const driverOptions = Array.from(new Set(data.transits.map((transit) => transit.driver)));

	const carOptions = Array.from(new Set(data.transits.map((transit) => transit.car)));

	let totalCurrentDriver = '';
	let totalCurrentCar = '';
	let totalDistance = 0;

	const updateTotalDistance = () => {
		totalDistance =
			data.transits.filter((transit) => {
				const driverMatch = transit.driver == totalCurrentDriver || totalCurrentDriver == 'any';
				const carMatch = transit.car == totalCurrentCar || totalCurrentCar == 'any';
				return driverMatch && carMatch;
			}).length * 2 *	data.userSettings.distance;
	};

	onMount(() => {
		transits.set(data.transits);
	});
</script>

{#if data.loaded}
	<table>
		<thead>
			<tr>
				<th>date</th>
				<th>driver</th>
				<th>car</th>
				<th>distance (1 way)</th>
				<th>edit</th>
				<th>delete</th>
			</tr>
		</thead>
		<tbody>
			{#each data.transits as transit, i}
				<tr>
					<td>{format(new Date(transit.date), 'eee LLL do')}</td>
					<td>{transit.driver}</td>
					<td>{transit.car}</td>
					<td>{data.userSettings.distance} miles</td>
					<td><button>edit</button></td>
					<td><button>delete</button></td>
				</tr>
			{/each}
		</tbody>
	</table>
	<button>add</button>
	<div>
		total miles for
		<select bind:value={totalCurrentDriver} on:change={() => updateTotalDistance()}>
			<option disabled value="">select driver...</option>
			{#each driverOptions as dOption}
				<option>{dOption}</option>
			{/each}
			<option value="any">Any driver</option>
		</select>
		in
		<select bind:value={totalCurrentCar} on:change={() => updateTotalDistance()}>
			<option disabled value="">select car...</option>
			{#each carOptions as cOption}
				<option>{cOption}</option>
			{/each}
			<option value="any">Any car</option>
		</select>
		: {totalDistance} miles
	</div>
{:else}
	<div>loading...</div>
{/if}
