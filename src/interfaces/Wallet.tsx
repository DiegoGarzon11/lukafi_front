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
	Debt_id: string;
	Person: string;
	Value: string;
	Reason: string;
	CreatedOn: string;
	DebtType: number;
	ModifyOn: string;
	Wallet_id: string;
}

export interface Wallet extends ApiResponse {
	wallet: wallet;
	debts: Debt[];
}
