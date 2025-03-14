const API_URL = import.meta.env.VITE_API_BACK_TEST || import.meta.env.VITE_API_URL;

export const GetAllCategories = async () => {
	try {
		const response = await fetch(`${API_URL}/category/get-all-categories`, {
			method: 'GET',
		});

		return await response.json();
	} catch (error) {
		console.error(error);
		console.warn('categories not found');
	}
};
