import { ApiResponse } from './Api';
export interface ResponseWallet extends ApiResponse {
	wallet: {
		created_in: string;
		salary: number;
		saving: number;
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
