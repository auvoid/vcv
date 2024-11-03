import { PUBLIC_WS_URI } from '$env/static/public';

export function createWebsocket() {
	let ws: WebSocket;
	let retries: number;
	let interval: NodeJS.Timeout | null;

	ws = new WebSocket(PUBLIC_WS_URI);
	ws.onclose = function (e) {
		console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
		interval = setInterval(function () {
			console.log('attempting reconnect');
			ws = new WebSocket(PUBLIC_WS_URI);
			retries++;
			if (retries < 10) return;
			if (!interval) return;
			clearInterval(interval);
		}, 2000);
	};
	ws.onopen = () => {
		interval = null;
		if (!interval) return;
		clearInterval(interval);
		console.log('connected to ws');
	};
	return ws;
}
