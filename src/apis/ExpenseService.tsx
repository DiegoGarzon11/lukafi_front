const API_URL = import.meta.env.VITE_API_BACK_TEST || import.meta.env.VITE_API_URL;
const MAIN_ROUTE = '/expense/';
export const NewExpense = async (data) => {
	if (!data) {
		console.warn('datos no enviados');

		return;
	}
	const formData = new URLSearchParams();
	formData.append('name', data.name);
	formData.append('value', data.value);
	formData.append('pay_each', data.pay_each);
	formData.append('dead_line', data.deadLine);
	formData.append('is_paid', data.is_paid);
	formData.append('paid_in', data.paid_in);
	formData.append('is_fixed', data.isFixed);
	formData.append('category_id', data.category_id);
	formData.append('category_name', data.category_name);

	try {
		const response = await fetch(`${API_URL + MAIN_ROUTE}new-expense/${data.wallet_id}/${data.user_id}`, {
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
			const response = await fetch(`${API_URL + MAIN_ROUTE}get-expenses/${data.wallet_id}?name=${data.search}`, {
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
			const response = await fetch(`${API_URL + MAIN_ROUTE}get-fixed-expenses/${data.wallet_id}?name=${data.search}`, {
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
export const PayFixedExpense = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}pay-expense/${data.wallet_id}/${data.expense_id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			return await response.json();
		} catch (error) {
			console.error(error);
		}
		return;
	}
	console.warn('datos no enviados');
};
export const ResetDeadLine = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}reset-deadline/${data.wallet_id}/${data.expense_id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			return await response.json();
		} catch (error) {
			console.error(error);
		}
		return;
	}
	console.warn('datos no enviados');
};
export const DeleteFixedExpense = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}delete-fixed-expense/${data.wallet_id}/${data.expense_id}`, {
				method: 'DELETE',
			});
			return await response.json();
		} catch (error) {
			console.error(error);
		}
		return;
	}
	console.warn('datos no enviados');
};

export const GetExpensesByCategory = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}get-expenses-by-category/${data}`, {
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

export const EditFixedExpenses = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}update-fixed-expenses/${data.expense_id}/${data.wallet_id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			return await response.json();
		} catch (error) {
			console.error(error);
		}
		return;
	}
	console.warn('datos no enviados');
};
