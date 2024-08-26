import { ApiResponse } from './Api';
export interface ResponseWallet extends ApiResponse {
	wallet: {
		debt_id: string;
		expense_id: string;
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
	wallet_id: string;
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
	total_value : number
	pay_each : string
}
