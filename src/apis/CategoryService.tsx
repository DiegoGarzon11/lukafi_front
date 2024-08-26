import { API_HTTP } from '@/tools/router';

export const GetAllCategories = async () => {
	try {
		const response = await fetch(`${API_HTTP}/category/get-all-categories`, {
			method: 'GET',
		});

		return await response.json();
	} catch (error) {
		console.error(error);
		console.warn('categories not found');
	}
};
