import { API_HTTP } from '@/tools/router';
export const UserRegister = async (data) => {
	const formData = new URLSearchParams();
	formData.append('name', data.name);
	formData.append('last_name', data.lastName);
	formData.append('email', data.email);
	formData.append('age', data.age);
	formData.append('nacionality', data.nacionality);
	formData.append('password', data.password);

	try {
		const response = await fetch(`${API_HTTP}/user/sign-up`, {
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
export const UserSignIn = async (data) => {
	const dataForm = new URLSearchParams();

	dataForm.append('email', data.email);
	dataForm.append('password', data.password);

	try {
		const response = await fetch(`${API_HTTP}/user/sign-in`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: dataForm,
		});
		return await response.json();
	} catch (error) {
		console.error(error);
	}
};
export const UserDefault = async () => {
	const token = localStorage.token;
	if (token) {
		try {
			const response = await fetch(`${API_HTTP}/user/default-user`, {
				method: 'GET',
				headers: {
					Authorization: token,
				},
			});
			return await response.json();
		} catch (error) {
			console.error(error);
		}
	} 
};
export const RestorePassword = async (data) => {
	const dataForm = new URLSearchParams();
	dataForm.append('email', data);

	try {
		const response = await fetch(`${API_HTTP}/user/restore-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: dataForm,
		});
		return await response.json();
	} catch (error) {
		console.error(error);
	}
};
export const GenerateNewPassword = async (password, token) => {
	const dataForm = new URLSearchParams();
	dataForm.append('newPassword', password);

	try {
		const response = await fetch(`${API_HTTP}/user/generate-new-password/${token}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: dataForm,
		});
		return await response.json();
	} catch (error) {
		console.error(error);
	}
};