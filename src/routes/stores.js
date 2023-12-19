import { writable } from 'svelte/store';

const createTransits = () => {
	const { subscribe, update, set } = writable([]);
	return {
		subscribe,
		set
	};
};

export const transits = createTransits();