export async function load({fetch}) {
	const res = await fetch('/api/transits', {
		method: 'GET',
		headers: {

			'content-type': 'application/json'
		}
	});
	const data = await res.json();
	const pageData = { loaded: data ? true : false, transits: data, userSettings: {distance: 52}};
	return pageData;
}
