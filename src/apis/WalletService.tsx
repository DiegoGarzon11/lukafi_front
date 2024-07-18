import { API_HTTP } from '@/tools/router';

export const GetWalletUser = async (user_id: string) => {
	if (user_id) {
		try {
			const response = await fetch(`${API_HTTP}/wallet/getWallet/${user_id}`, {
				method: 'GET',
			});

			return await response.json();
		} catch (error) {
			console.log(error);
		}
	} else {
		console.log('Wallet not found');
	}
};
export const CreateWallet = async (data) => {
	if (data) {
		const formData = new URLSearchParams();
		formData.append('Salary', data.salary);
		formData.append('Saving', data.saving);
		formData.append('FixedCosts', JSON.stringify(data.FixedCosts));
		formData.append('FixedIncomes', JSON.stringify(data.FixedIncomes));
		formData.append('Month', data.month);
		formData.append('Year', data.year);
		formData.append('User_id', data.user_id);
		try {
			const response = await fetch(`${API_HTTP}/wallet/newWallet`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: formData,
			});
			return await response.json();
		} catch (error) {
			console.log(error);
		}
		return;
	}
	console.log('datos no enviados');
};