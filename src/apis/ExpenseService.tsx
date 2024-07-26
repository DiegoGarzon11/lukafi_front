import { API_HTTP } from '@/tools/router';
const MAIN_ROUTE = '/expense/';
export const NewExpense = async (data) => {
	if (data) {
		const formData = new URLSearchParams();
		formData.append('Name', data.name);
		formData.append('Value', data.value);
		formData.append('DeadLine', data.deadLine);
		formData.append('IsFixed', data.isFixed);

		try {
			const response = await fetch(`${API_HTTP + MAIN_ROUTE}newExpense/${data.Wallet_id}/${data.User_id}`, {
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