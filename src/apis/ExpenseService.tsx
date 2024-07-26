import { API_HTTP } from '@/tools/router';
const MAIN_ROUTE = '/expense/';
export const NewExpense = async (data) => {
	if (!data) {
		console.warn('datos no enviados');

		return;
	}
	const formData = new URLSearchParams();
	formData.append('name', data.name);
	formData.append('value', data.value);
	formData.append('dead_line', data.deadLine);
	formData.append('is_fixed', data.isFixed);

	try {
		const response = await fetch(`${API_HTTP + MAIN_ROUTE}new-expense/${data.wallet_id}/${data.user_id}`, {
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
};
