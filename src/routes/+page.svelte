<script>
	import { transits } from './stores';
	export let data;
	import { onMount } from 'svelte';
	import { format } from 'date-fns';
	import TableRow from './TableRow.svelte';

	let totalCurrentDriver = '';
	let totalCurrentCar = '';
	let totalDistance = 0;

	const populateFilterOptions = (sourceList, key) => {
		const simpleArray = sourceList.map((item) => item[key]);
		const uniqueArray = Array.from(new Set(simpleArray));
		return uniqueArray;
	};

	let driverOptions = populateFilterOptions(data.transits, 'driver');
	let carOptions = populateFilterOptions(data.transits, 'car');

	const updateTotalDistance = () => {
		const filteredTransits = $transits.filter((transit) => {
			const driverMatch = transit.driver == totalCurrentDriver || totalCurrentDriver == 'any';
			const carMatch = transit.car == totalCurrentCar || totalCurrentCar == 'any';
			return driverMatch && carMatch;
		});
		let currentTotal = 0;
		filteredTransits.forEach((transit) => {
			const distance = transit.custom_distance
				? transit.custom_distance
				: data.userSettings.distance;
			currentTotal += distance * 2;
		});
		totalDistance = currentTotal;
	};

	const getTransits = async () => {
		const res = await fetch('/api/transits', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		const data = await res.json();
		transits.set(data);
		driverOptions = populateFilterOptions($transits, 'driver');
		carOptions = populateFilterOptions($transits, 'car');
	};

	onMount(() => {
		transits.set(data.transits);
	});
</script>

{#if data.loaded}
	<p>default transit distance: {data.userSettings.distance} miles</p>
	<button on:click={getTransits}>refresh</button>
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
			{#each $transits as transit, i}
				<TableRow transit={transit} data={data} />
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
