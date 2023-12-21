import { json } from '@sveltejs/kit';

export async function GET() {
	const res = await fetch('https://crud-5h2d.api.codehooks.io/dev/transits', {
		method: 'GET',
		headers: {
			'x-api-key': 'f2a6d690-3f33-454a-b94c-5c1ae6b9422b',
			'content-type': 'application/json'
		}
	});

  const data = await res.json();

	return json(data);
}
