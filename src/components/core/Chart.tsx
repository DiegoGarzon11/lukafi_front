import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GetDailyExpenses } from '@/apis/ExpenseService';
import { useEffect, useState } from 'react';
import { GetWalletUser } from '@/apis/WalletService';

const CustomTooltip = ({ payload }) => {
	return (
		<div className='custom-tooltip'>
			<p className='payload'>
				en el dia {payload[0]?.payload?.date} gastaste {Number(payload[0]?.payload?.total_value).toLocaleString()}
			</p>
		</div>
	);
};

export const Chart = () => {
	const userInfo = JSON.parse(localStorage.userMain);
	const [expensesPaid, setExpensesPaid] = useState();

	useEffect(() => {
		GetWalletUser(userInfo?.user_id).then((result) => {
			GetDailyExpenses(result?.wallet?.wallet_id).then((expenses) => {
				console.log(expenses);

				setExpensesPaid(expenses?.expenses);
			});
		});
	}, []);

	console.log(expensesPaid);

	return (
		<ResponsiveContainer
			width='100%'
			height='100%'>
			<LineChart
				width={500}
				height={300}
				data={expensesPaid}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}>
				<CartesianGrid strokeDasharray=' 3 3' />
				<XAxis dataKey='date' />
				<YAxis />
				<Tooltip content={CustomTooltip} />
				<Legend />
				<Line
					activeDot={{ r: 8 }}
					type='natural'
					dataKey='total_value'
					stroke='red'
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};
