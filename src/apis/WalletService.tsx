import { API_HTTP } from '@/tools/router';

export const GetWalletUser = async (user_id: string) => {
	if (user_id) {
		try {
			const response = await fetch(`${API_HTTP}/wallet/get-wallet/${user_id}`, {
				method: 'GET',
			});

			return await response.json();
		} catch (error) {
			console.error(error);
		}
	} else {
		console.warn('Wallet not found');
	}
};
export const CreateWallet = async (data) => {
	if (data) {
		const formData = new URLSearchParams();
		formData.append('currency_type', data.currency_type);
		formData.append('salary', data.salary);
		formData.append('saving', data.saving);
		formData.append('user_id', data.user_id);
		try {
			const response = await fetch(`${API_HTTP}/wallet/new-wallet`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: formData,
			});
			return await response.json();
		} catch (error) {
			console.error(error);
		}
		return;
	}
	console.warn('datos no enviados');
};
