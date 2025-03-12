import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
	Sector,
	AreaChart,
	Area,
	Bar,
	Rectangle,
	BarChart,
} from 'recharts';
import { GetExpensesByCategory } from '@/apis/ExpenseService';
import { useEffect, useState } from 'react';
import { GetWalletUser, GetWalletValues, GetDailyReport, GetMonthlyReport } from '@/apis/WalletService';
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
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const CustomTooltipDaily = ({ payload }) => {
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
			{payload.map((p, i) => (
				<p key={i}>
					{localStorage.getItem('filterChartBalance') === 'day' ? (
						<span className='text-green-500'>
							{t('dashboard.chart')} {p.payload?.day}
						</span>
					) : (
						<span className='text-green-500'>El mes de {months[Number(p.payload?.month - 1)]}</span>
					)}
					<span className={`text-[${validateColor(p.name)}]`}> {validateName(p.name)} </span>
					<span className={`text-[${validateColor(p.name)}]`}> {Number(p.value).toLocaleString()} </span>
				</p>
			))}
		</div>
	);
};

export const Chart = ({ trigger, filter }) => {
	const userInfo = JSON.parse(localStorage.userMain);
	const [report, setReport] = useState();

	useEffect(() => {
		const getDailyFixed = async () => {
			const wallet = await GetWalletUser(userInfo?.user_id);
			const dailyReport = await GetDailyReport(wallet?.wallet?.wallet_id);
			const monthlyReport = await GetMonthlyReport(wallet?.wallet?.wallet_id);
			if (filter === 'day') {
				setReport(dailyReport.results);
			} else if (filter === 'month') {
				setReport(monthlyReport.results);
			}
		};
		getDailyFixed();
	}, [trigger, filter]);

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
				<Tooltip content={CustomTooltipDaily} />
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
					className='hidden md:block'
					d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
					stroke={fill}
					fill='none'
				/>
				<circle
					className='hidden md:block'
					cx={ex}
					cy={ey}
					r={2}
					fill={fill}
					stroke='none'
				/>
				<text
					className='hidden md:block'
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					textAnchor={textAnchor}
					fontSize={18}
					fontWeight={600}
					fill='green'>{`${value.toLocaleString()}$`}</text>
				<text
					className='hidden md:block'
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fontSize={16}
					fontWeight={600}
					fill='green'>
					{`${(percent * 100).toFixed(2)}%`}
				</text>

				<text
					className='block md:hidden'
					x={ex + (cos >= 0 ? -35 : 35) * 1}
					y={ey}
					textAnchor={textAnchor}
					fontSize={18}
					fontWeight={600}
					fill='green'>{`${value.toLocaleString()}$`}</text>
				<text
					className='block md:hidden'
					x={ex + (cos >= 0 ? -35 : 35) * 1}
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
					className='hidden md:block'
					d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
					stroke={fill}
					fill='none'
				/>
				<circle
					className='hidden md:block'
					cx={ex}
					cy={ey}
					r={2}
					fill={fill}
					stroke='none'
				/>

				<text
					className='hidden md:block'
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					textAnchor={textAnchor}
					fontSize={18}
					fontWeight={600}
					fill='green'>{`${value.toLocaleString()}$`}</text>
				<text
					className='hidden md:block'
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fontSize={16}
					fontWeight={600}
					fill='green'>
					{`${(percent * 100).toFixed(2)}%`}
				</text>

				<text
					className='block md:hidden'
					x={ex + (cos >= 0 ? -35 : 35) * 1}
					y={ey}
					textAnchor={textAnchor}
					fontSize={18}
					fontWeight={600}
					fill='green'>{`${value.toLocaleString()}$`}</text>
				<text
					className='block md:hidden'
					x={ex + (cos >= 0 ? -35 : 35) * 1}
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
					<Tooltip content={CustomTooltipDaily} />
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

export const ChartExample = () => {
	const data = [
		{
			name: 'Enero',
			ingresos: 500,
			deudas: 800,
		},
		{
			name: 'Febrero',
			ingresos: 1000,
			deudas: 200,
		},
		{
			name: 'Marzo',
			ingresos: 2200,
			deudas: 700,
		},
		{
			name: 'Abril',
			ingresos: 1500,
			deudas: 1300,
		},
		{
			name: 'Mayo',
			ingresos: 2500,
			deudas: 1100,
		},
		{
			name: 'Abril',
			ingresos: 2600,
			deudas: 700,
		},
	];
	return (
		<LineChart
			width={500}
			height={300}
			data={data}
			margin={{
				top: 5,
				right: 30,
				left: 20,
				bottom: 5,
			}}>
			<CartesianGrid
				strokeDasharray=' 3 3'
				opacity={0.2}
			/>
			<XAxis dataKey='name' />
			<YAxis />
			<Legend />

			<Line
				type='bump'
				dataKey='ingresos'
				stroke='#a8fa0a'
				strokeWidth={3}
			/>
			<Line
				type='bump'
				dataKey='deudas'
				stroke='#8884d8'
				strokeWidth={3}
			/>
		</LineChart>
	);
};

export const ChartExampleTwo = () => {
	const datos = [
		{
			name: 'Enero',
			ahorro: 1000,
			deudas: 3000,
		},
		{
			name: 'Febrero',
			ahorro: 2000,
			deudas: 1800,
		},
		{
			name: 'Marzo',
			ahorro: 2400,
			deudas: 2000,
		},
		{
			name: 'Abril',
			ahorro: 2200,
			deudas: 1800,
		},
		{
			name: 'Mayo',
			ahorro: 3000,
			deudas: 900,
		},
		{
			name: 'Junio',
			ahorro: 3400,
			deudas: 200,
		},
		{
			name: 'Julio',
			ahorro: 4000,
			deudas: 100,
		},
	];

	return (
		<BarChart
			width={600}
			height={300}
			data={datos}
			margin={{
				top: 5,
				right: 30,
				left: 20,
				bottom: 5,
			}}>
			<CartesianGrid
				strokeDasharray='3 3 '
				opacity={0.2}
			/>

			<XAxis dataKey='name' />
			<YAxis />
			<Legend />
			<Bar
				dataKey='deudas'
				fill='#fe337c'
				activeBar={
					<Rectangle
						fill='pink'
						stroke='blue'
					/>
				}
			/>
			<Bar
				dataKey='ahorro'
				fill='#7fbd0c'
				activeBar={
					<Rectangle
						fill='gold'
						stroke='purple'
					/>
				}
			/>
		</BarChart>
	);
};
