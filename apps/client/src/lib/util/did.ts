export function formatDid(did: string) {
	const parts = did.split(':');

	if (parts.length < 3) {
		throw new Error('Invalid DID format');
	}

	if (parts[1] === 'web') {
		const lastSegment = parts[2];
		return lastSegment;
	}
	const method = parts[1];
	const identifier = parts[2];
	const formattedDid = `did:${method}:${identifier.slice(0, 3)}...${identifier.slice(-6)}`;

	return formattedDid;
}
