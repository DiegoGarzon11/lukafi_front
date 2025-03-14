const API_URL = import.meta.env.VITE_API_BACK_TEST || import.meta.env.VITE_API_URL;
const MAIN_ROUTE = '/debt/';

export const NewDebt = async (data) => {
	if (!data) {
		return;
	}
	const formData = new URLSearchParams();
	formData.append('person', data.person);
	formData.append('value', data.value);
	formData.append('dead_line', data.date);
	formData.append('reason', data.reason);
	formData.append('debt_type', data.debtType);

	try {
		const response = await fetch(`${API_URL + MAIN_ROUTE}new-debt/${data.wallet_id}/${data.user_id}`, {
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

export const GetDebts = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}get-debts/${data.wallet_id}`, {
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
export const addAmount = async (data) => {
	if (data) {
		try {
			const formData = new URLSearchParams();
			formData.append('amount', data.amount);
			const response = await fetch(`${API_URL + MAIN_ROUTE}add-amount/${data.wallet_id}/${data.debt_id}`, {
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
export const GetDebtToHistory = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}get-histories/${data.debt_id}`, {
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

export const DeleteDebt = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL + MAIN_ROUTE}delete-debt/${data.wallet_id}/${data.debt_id}`, {
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
