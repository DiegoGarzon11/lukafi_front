import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Sector } from 'recharts';
import { GetDailyExpenses, GetExpensesByCategory } from '@/apis/ExpenseService';
import { useEffect, useState } from 'react';
import { GetWalletUser } from '@/apis/WalletService';
import { PieChart, Pie } from 'recharts';
import { ExpensesByCategory } from '@/interfaces/Wallet';

const CustomTooltip = ({ payload }) => {
	return (
		<div className='custom-tooltip'>
			<p className='payload'>
				en el dia {payload[0]?.payload?.date} gastaste {Number(payload[0]?.payload?.total_value).toLocaleString()}
			</p>
		</div>
	);
};

export const Chart = ({ trigger }) => {
	const userInfo = JSON.parse(localStorage.userMain);
	const [expensesPaid, setExpensesPaid] = useState();

	useEffect(() => {
		const getDailyFixed = async () => {
			const wallet = await GetWalletUser(userInfo?.user_id);
			const dailyExpenses = await GetDailyExpenses(wallet?.wallet?.wallet_id);
			setExpensesPaid(dailyExpenses?.expenses);
		};
		getDailyFixed();
	}, [trigger]);

	return (
		<ResponsiveContainer height={330}>
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
					type='bump'
					dataKey='total_value'
					stroke='red'
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

const COLORS = [
	'#E85C0D',
	'#3795BD',
	'#88D66C',
	'#3FA2F6',
	'#F4CE14',
	'#4C3BCF',
	'#E88D67',
	'#B7B597',
	'#FF5F00',
	'#A91D3A',
	'#68D2E8',
	'#E9C874',
	'#481E14',
];
const showName = (props) => {
	const RADIAN = Math.PI / 180;
	const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 30) * cos;
	const my = cy + (outerRadius + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? 'start' : 'end';

	return (
		<g>
			<text
				x={cx}
				y={cy}
				dy={8}
				textAnchor='middle'
				fill={fill}>
				{payload.category_name}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
			<path
				d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
				stroke={fill}
				fill='none'
			/>
			<circle
				cx={ex}
				cy={ey}
				r={2}
				fill={fill}
				stroke='none'
			/>
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				textAnchor={textAnchor}
				fill='#333'>{`Valor ${value.toLocaleString()}`}</text>
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				dy={18}
				textAnchor={textAnchor}
				fill='#999'>
				{`(Rate ${(percent * 100).toFixed(2)}%)`}
			</text>
		</g>
	);
};
export const ChartDonut = ({ trigger }) => {
	const userInfo = JSON.parse(localStorage.userMain);
	const [expensesByCategory, setExpensesByCategory] = useState<Array<ExpensesByCategory>>([]);

	useEffect(() => {
		const getExpensesCategory = async () => {
			const wallet = await GetWalletUser(userInfo?.user_id);
			const expensesByCategory = await GetExpensesByCategory(wallet?.wallet.wallet_id);
			setExpensesByCategory(expensesByCategory?.expenses);
		};
		getExpensesCategory();
	}, [trigger]);

	return (
		<ResponsiveContainer height={330}>
			<PieChart
				width={600}
				height={400}>
				<Pie
					activeShape={showName}
					data={expensesByCategory}
					cx='50%'
					cy='50%'
					innerRadius={60}
					outerRadius={80}
					fill='#8884d8'
					dataKey='value'>
					{expensesByCategory?.map((e, i) => (
						<Cell
							key={e.expense_id}
							fill={COLORS[i % COLORS.length]}
						/>
					))}
				</Pie>

				<Tooltip active={false} />
			</PieChart>
		</ResponsiveContainer>
	);
};
