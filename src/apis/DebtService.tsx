import { API_HTTP } from '@/tools/router';

export const NewDebt = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_HTTP}/wallet/newDebt/${data.Wallet_id}/${data.User_id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			return await response.json();
		} catch (error) {
			console.log(error);
		}
		return;
	}
	console.log('datos no enviados');
};

export const GetDebts = async (data) => {
	

	if (data) {
		try {
			const response = await fetch(`${API_HTTP}/wallet/getDebts/${data.Wallet_id}/${data.User_id}`, {
				method: 'GET',
			});

			return await response.json();
		} catch (error) {
			console.log(error);
		}
		return;
	}
	console.log('datos no enviados');
};
