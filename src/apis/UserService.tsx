import { API_HTTP } from '@/tools/router';
export const UserRegister = async (data) => {
	const formData = new URLSearchParams();
	formData.append('Name', data.name);
	formData.append('LastName', data.lastName);
	formData.append('Email', data.email);
	formData.append('Age', data.age);
	formData.append('Nacionality', data.nacionality);
	formData.append('Password', data.password);


	try {
		const response = await fetch(`${API_HTTP}/user/signUp`, {
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
};
export const UserSignIn = async (data) => {
	const dataForm = new URLSearchParams();

	dataForm.append('Email', data.email);
	dataForm.append('Password', data.password);

	try {
		const response = await fetch(`${API_HTTP}/user/signIn`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: dataForm,
		});
		return await response.json();
	} catch (error) {
		console.log(error);
	}
};
export const UserDefault = async () => {
	const token = localStorage.token;
	if (token) {
		try {
			const response = await fetch(`${API_HTTP}/user/defaultUser`, {
				method: 'GET',
				headers: {
					Authorization: token,
				},
			});
			return await response.json();
		} catch (error) {
			console.log(error);
		}
	} else {
		return console.log('user not found');
	}
};
