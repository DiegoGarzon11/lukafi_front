const API_URL = import.meta.env.VITE_API_BACK_TEST || import.meta.env.VITE_API_URL;
console.log(API_URL);

export const UserRegister = async (data) => {
	const formData = new URLSearchParams();
	formData.append('name', data.name);
	formData.append('last_name', data.lastName);
	formData.append('email', data.email);
	formData.append('age', data.age);
	formData.append('nacionality', data.nacionality);
	formData.append('password', data.password);

	try {
		const response = await fetch(`${API_URL}/user/sign-up`, {
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
		const response = await fetch(`${API_URL}/user/sign-in`, {
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
			const response = await fetch(`${API_URL}/user/default-user`, {
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
export const UserIconUpdate = async (data) => {
	const dataForm = new URLSearchParams();
	dataForm.append('icon', data.icon);
	dataForm.append('user_id', data.user_id);

	try {
		const response = await fetch(`${API_URL}/user/update-icon`, {
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
export const RestorePassword = async (data) => {
	const dataForm = new URLSearchParams();
	dataForm.append('email', data);

	try {
		const response = await fetch(`${API_URL}/user/restore-password`, {
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
		const response = await fetch(`${API_URL}/user/generate-new-password/${token}`, {
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

// !espera del back para eliminar usuario con token
export const DeleteUser = async (data) => {
	const { email, password, token } = data;
	try {
		const response = await fetch(`${API_URL}/user/sign-out`, {
			method: 'DELETE',
			body: JSON.stringify({ email, password }),
			headers: {
				'Content-Type': 'application/json',
				Authorization: token,
			},
		});
		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

export const RestoreAccount = async () => {
	try {
		const response = await fetch(`${API_URL}/user/restore-account`, {
			method: 'POST',
			headers: {
				Authorization: localStorage.token,
			},
		});
		return await response.json();
	} catch (error) {
		console.error(error);
	}
};
export const EditUser = async (data) => {
	const dataForm = new URLSearchParams();
	dataForm.append('name', data.name);
	dataForm.append('last_name', data.lastName);
	dataForm.append('email', data.email);
	dataForm.append('user_id', data.user);

	try {
		const response = await fetch(`${API_URL}/user/update-user`, {
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
