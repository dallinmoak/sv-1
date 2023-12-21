<script>
	import { transits } from './stores';
	export let data;
	import { onMount } from 'svelte';
	import { format } from 'date-fns';

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
		const res = await fetch('https://crud-5h2d.api.codehooks.io/dev/transits', {
			method: 'GET',
			headers: {
				'x-api-key': 'f2a6d690-3f33-454a-b94c-5c1ae6b9422b',
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
				<tr>
					<td>{format(new Date(transit.date), 'eee LLL do')}</td>
					<td>{transit.driver}</td>
					<td>{transit.car}</td>
					<td
						>{transit.custom_distance ? transit.custom_distance : data.userSettings.distance} miles</td
					>
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
