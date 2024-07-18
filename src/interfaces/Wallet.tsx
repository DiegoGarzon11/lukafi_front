export interface wallet {
	Debts: string;
	Expenses: string;
	FixedCosts: string;
	FixedIncomes: string;
	Incomes: string;
	Month: string;
	Salary: string;
	Saving: string;
	User_id: string;
	Wallet_id: string;
	Year: string;
}
export interface ApiResponse {
	success: boolean;
	message: string;
	status: number;
}

export interface Debt {
	id: string;
	person: string;
	value: string;
	reason: string;
	date: string;
	debtType : number
}

export interface Wallet extends ApiResponse {
	wallet: wallet;
	debts: Debt[];
}
