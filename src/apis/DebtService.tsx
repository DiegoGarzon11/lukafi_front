import { API_HTTP } from '@/tools/router';
const MAIN_ROUTE = '/debt/';

export const NewDebt = async (data) => {
	if (data) {
		const formData = new URLSearchParams();
		formData.append('Person', data.person);
		formData.append('Value', data.value);
		formData.append('Reason', data.reason);
		formData.append('DebtType', data.debtType);

		try {
			const response = await fetch(`${API_HTTP + MAIN_ROUTE}newDebt/${data.Wallet_id}/${data.User_id}`, {
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

export const GetDebts = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_HTTP + MAIN_ROUTE}getDebts/${data.Wallet_id}`, {
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

export const DeleteDebt = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_HTTP + MAIN_ROUTE}deleteDebt/${data.Wallet_id}/${data.Debt_id}`, {
				method: 'DELETE',
			});
			return await response.json();
		} catch (error) {
			console.log(error);
		}
		return;
	}
	console.log('datos no enviados');
};
