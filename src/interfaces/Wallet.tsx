export interface wallet {
	Salary: string;
	Saving: string;
}
export interface ApiResponse {
	success: boolean;
	message: string;
	status: number;
}

export interface Debt {
	id: string;
	fromPerson: string;
	toPerson: string;
	value: string;
	reason: string;
	date: string;
}

export interface Wallet extends ApiResponse {
	wallet: wallet;
	debts: Debt[];
}
