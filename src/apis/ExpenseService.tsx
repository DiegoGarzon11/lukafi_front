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
	formData.append('is_paid', data.is_paid);
	formData.append('paid_in', data.paid_in);
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

export const GetExpenses = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_HTTP + MAIN_ROUTE}get-expenses/${data.wallet_id}`, {
				method: 'GET',
			});

			return await response.json();
		} catch (error) {
			console.error(error);
		}
		return;
	}
	console.warn('datos no enviados');
};
export const GetFixedExpenses = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_HTTP + MAIN_ROUTE}get-fixed-expenses/${data}`, {
				method: 'GET',
			});

			return await response.json();
		} catch (error) {
			console.error(error);
		}
		return;
	}
	console.warn('datos no enviados');
};
export const GetDailyExpenses = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_HTTP + MAIN_ROUTE}get-daily-expenses/${data}`, {
				method: 'GET',
			});

			return await response.json();
		} catch (error) {
			console.error(error);
		}
		return;
	}
	console.warn('datos no enviados');
};
