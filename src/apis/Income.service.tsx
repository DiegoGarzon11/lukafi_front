const API_URL = import.meta.env.VITE_API_BACK_TEST || import.meta.env.VITE_API_URL;

const MAIN_ROUTE = '/income/';

export const AddNewIncome = async (data) => {
	if (!data) {
		return;
	}
	const formData = new URLSearchParams();
	formData.append('name', data.name);
	formData.append('value', data.value);
	formData.append('wallet_id', data.wallet_id);

	try {
		const response = await fetch(`${API_URL + MAIN_ROUTE}new-income/${data.wallet_id}/${data.user_id}`, {
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

export const GetAllIncomes = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}get-all-incomes/${data.wallet_id}?name=${data.search}`, {
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

export const GetDailyIncomes = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}get-daily-incomes/${data}`, {
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

export const DeleteIncome = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}delete-income/${data.wallet_id}/${data.income_id}`, {
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
