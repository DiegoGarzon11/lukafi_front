const API_URL = import.meta.env.VITE_API_BACK_TEST || import.meta.env.VITE_API_URL;

export const GetWalletUser = async (user_id: string) => {
	if (user_id) {
		try {
			const response = await fetch(`${API_URL}/wallet/get-wallet/${user_id}`, {
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
export const GetWalletValues = async (wallet_id: string) => {
	if (wallet_id) {
		try {
			const response = await fetch(`${API_URL}/wallet/get-wallet-values/${wallet_id}`, {
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
			const response = await fetch(`${API_URL}/wallet/new-wallet`, {
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
export const GetDailyReport = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL}/wallet/get-daily-report/${data}`, {
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

export const GetMonthlyReport = async (data) => {
	if (data) {
		try {
			const response = await fetch(`${API_URL}/wallet/get-monthly-report/${data}`, {
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
export const EditSavingGoal = async (data) => {
	if (data) {
		const formData = new URLSearchParams();
		formData.append('saving', data.amount);
		formData.append('wallet_id', data.wallet_id);
		formData.append('wallet_id', data.user_id);
		try {
			const response = await fetch(`${API_URL}/wallet/edit-saving-goal/${data.wallet_id}/${data.user_id}`, {
				method: 'PATCH',
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
