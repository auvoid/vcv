import { default as Axios } from 'axios';
import { PUBLIC_BASE_URI } from '$env/static/public';
import { token } from '$lib/store/store';
import { addToast } from '../../routes/store';

let apiClient = Axios.create({
	baseURL: PUBLIC_BASE_URI,
	withCredentials: true
});

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		console.log('WAFSWADFA');
		if (!error.response) return Promise.reject(error);
		if (error.response.status === 401) {
			return Promise.reject(error);
		}
		addToast({
			message: error.response.data.message,
			type: 'error'
		});

		return Promise.reject(error);
	}
);

let embedClient = Axios.create({
	baseURL: PUBLIC_BASE_URI,
	withCredentials: true
});

token.subscribe((_token) => {
	apiClient = Axios.create({
		baseURL: PUBLIC_BASE_URI,
		withCredentials: true,
		headers: {
			Authorization: 'Bearer ' + _token
		}
	});
	apiClient.interceptors.response.use(
		(response) => {
			return response;
		},
		async function (error) {
			console.log('WAFSWADFA');
			if (!error.response) return Promise.reject(error);
			if (error.response.status === 401) {
				return Promise.reject(error);
			}
			addToast({
				message: error.response.data.message,
				type: 'error'
			});

			return Promise.reject(error);
		}
	);
});

export { apiClient, embedClient };
