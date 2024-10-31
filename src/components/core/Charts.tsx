import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Sector, AreaChart, Area } from 'recharts';
import { GetExpensesByCategory } from '@/apis/ExpenseService';
import { useEffect, useState } from 'react';
import { GetWalletUser, GetWalletValues, GetDailyReport } from '@/apis/WalletService';
import { PieChart, Pie } from 'recharts';
import { ExpensesByCategory, Incomes, wallet_values } from '@/interfaces/Wallet';
import { useTranslation } from 'react-i18next';

const COLORS = [
	'#00FF9C',
	'#72BF78',
	'#06D001',
	'#15B392',
	'#399918',
	'#9BEC00',
	'#81A263',
	'#C3FF93',
	'#0A6847',
	'#12372A',
	'#739072',
	'#186F65',
	'#96C291',
];
const CustomTooltip = ({ payload }) => {
	const { t, i18n } = useTranslation();
	i18n.changeLanguage();
	function validateColor(name) {
		if (name === 'expenses') {
			return '#9BEC00';
		} else if (name === 'incomes') {
			return 'red';
		}
	}
	function validateName(name) {
		if (name === 'expenses') {
			return 'gastaste ';
		} else if (name === 'incomes') {
			return 'ingresaste ';
		}
	}

	return (
		<div className='bg-zinc-900 p-5 rounded-md'>
			{payload.map((p) => (
				<p>
					{t('dashboard.chart')} {p.payload?.day}
					<span className={`text-[${validateColor(p.name)}]`}> {validateName(p.name)} </span>
					<span className={`text-[${validateColor(p.name)}]`}> {Number(p.value).toLocaleString()} </span>
				</p>
			))}
		</div>
	);
};

export const Chart = ({ trigger }) => {
	const userInfo = JSON.parse(localStorage.userMain);
	const [report, setReport] = useState();

	useEffect(() => {
		const getDailyFixed = async () => {
			const wallet = await GetWalletUser(userInfo?.user_id);
			const dailyReport = await GetDailyReport(wallet?.wallet?.wallet_id);
			setReport(dailyReport.results);
		};
		getDailyFixed();
	}, [trigger]);

	return (
		<ResponsiveContainer height={330}>
			<LineChart
				width={500}
				height={300}
				data={report}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}>
				<CartesianGrid strokeDasharray=' 3 3' />
				<XAxis dataKey='day' />
				<YAxis />
				<Tooltip content={CustomTooltip} />
				<Legend />
				<Line
					activeDot={{ r: 5 }}
					strokeWidth={3}
					type='bump'
					dataKey='expenses'
					stroke='#15B392'
				/>
				<Line
					strokeWidth={3}
					activeDot={{ r: 5 }}
					type='bump'
					dataKey='incomes'
					stroke='#9BEC00'
				/>
			</LineChart>
		</ResponsiveContainer>
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
					{payload.category_name || payload.name}
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
					fontSize={18}
					fontWeight={600}
					fill='green'>{`${value.toLocaleString()}$`}</text>
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fontSize={16}
					fontWeight={600}
					fill='green'>
					{`${(percent * 100).toFixed(2)}%`}
				</text>
			</g>
		);
	};

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

export const ChartFinance = () => {
	const [values, setValues] = useState<wallet_values | undefined>();
	const userInfo = JSON.parse(localStorage.userMain);

	useEffect(() => {
		const getExpensesCategory = async () => {
			const wallet = await GetWalletUser(userInfo?.user_id);
			const walletValues = await GetWalletValues(wallet?.wallet.wallet_id);
			setValues(walletValues.wallet_values);
		};
		getExpensesCategory();
	}, []);

	const percentageData = [
		{
			name: 'Disponible',
			value: values?.available,
			color: COLORS[0],
		},
		{
			name: 'Gastos fijos',
			value: values?.fixed_expenses,
			color: COLORS[1],
		},
		{
			name: 'Gastos variables',
			value: values?.variable_expenses,
			color: COLORS[2],
		},
		{
			name: 'Deudas',
			value: values?.debts,
			color: COLORS[3],
		},
		{
			name: 'Ingresos',
			value: values?.incomes,
			color: COLORS[4],
		},
	];
	const showName = (props) => {
		const RADIAN = Math.PI / 180;
		const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value, percent } = props;
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
					{payload.category_name || payload.name}
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
					fontSize={18}
					fontWeight={600}
					fill='green'>{`${value.toLocaleString()}$`}</text>
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fontSize={16}
					fontWeight={600}
					fill='green'>
					{`${(percent * 100).toFixed(2)}%`}
				</text>
			</g>
		);
	};

	return (
		<ResponsiveContainer height={310}>
			<PieChart
				width={600}
				height={400}>
				<Pie
					activeShape={showName}
					data={percentageData}
					cx='50%'
					cy='50%'
					innerRadius={60}
					outerRadius={80}
					fill='#8884d8'
					dataKey='value'>
					{percentageData?.map((e) => (
						<Cell
							key={e.name}
							fill={e.color}
						/>
					))}
				</Pie>

				<Tooltip active={false} />
			</PieChart>
		</ResponsiveContainer>
	);
};

export const ChartIncomes = ({ trigger }) => {
	const userInfo = JSON.parse(localStorage.userMain);
	const [incomes, setIncomes] = useState<Array<Incomes>>([]);

	useEffect(() => {
		const getIncomes = async () => {
			const wallet = await GetWalletUser(userInfo?.user_id);

			const incomes = await GetDailyReport(wallet?.wallet.wallet_id);
			setIncomes(incomes?.results);
		};
		getIncomes();
	}, [trigger]);
	return (
		<>
			<p>Registros de ingresos</p>

			<ResponsiveContainer
				width='100%'
				height='85%'>
				<AreaChart
					width={500}
					height={400}
					data={incomes}
					margin={{
						top: 10,
						right: 30,
						left: 0,
						bottom: 0,
					}}>
					<CartesianGrid
						horizontal={false}
						vertical={false}
					/>
					<Tooltip content={CustomTooltip} />
					<XAxis dataKey='day' />
					<Area
						type='monotone'
						dataKey='incomes'
						stroke='green'
						fill='green'
						fillOpacity={1}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</>
	);
};
