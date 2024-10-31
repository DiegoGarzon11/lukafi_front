import { ApiResponse } from './Api';
export interface ResponseWallet extends ApiResponse {
	wallet: {
		created_in: string;
		available: number;
		salary: number;
		saving: number;
		fixed_expenses: number;
		incomes: number;
		debts: number;
		variable_expenses: number;
		user_id: string;
		wallet_id: string;
	};
}
export interface Debt extends ApiResponse {
	created_in: string;
	debt_type: number;
	debt_id: string;
	modify_in: null;
	person: string;
	reason: string;
	value: number;
	missing_payment: number;
	dead_line: string;
	wallet_id: string;
}
export interface DebtsHistory extends ApiResponse {
	id: string;
	amount: number;
	date: string;
	debt_id: string;
}
export interface Expenses extends ApiResponse {
	created_in: string;
	dead_line: string;
	expense_id: string;
	is_fixed: boolean;
	name: string;
	paid_in: string | null;
	value: number;
	is_paid: boolean;
	wallet_id: string;
	total_value: number;
	pay_each: string;
}
export interface ExpensesByCategory {
	expense_id: string;
	category_name: string;
	total: number;
}

export interface wallet_values extends ApiResponse {
	salary: number;
	available: number;
	incomes : number
	saving: number;
	fixed_expenses: number;
	variable_expenses: number;
	debts: number;

}
export interface Incomes extends ApiResponse  {
	income_id : string,
	name : string,
	value : number,
	date : string
}
export interface HistoryReport extends ApiResponse {
	date: string;
}