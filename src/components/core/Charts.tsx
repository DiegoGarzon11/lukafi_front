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
import {GetExpensesByCategory} from '@/apis/ExpenseService';
import {useEffect, useState} from 'react';
import {GetWalletUser, GetWalletValues, GetDailyReport, GetMonthlyReport} from '@/apis/WalletService';
import {PieChart, Pie} from 'recharts';
import {ExpensesByCategory, Incomes, wallet_values} from '@/interfaces/Wallet';
import {useTranslation} from 'react-i18next';

const COLORS = ['#7fbd0c', '#fe337c', '#ff654e', '#fe337c', '#0af9e2'];
const MAIN_COLOR = '#7fbd0c';
const SECOND_COLOR = '#fe337c';
const months = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
];
const CustomTooltipDaily = ({payload}) => {
	const {t, i18n} = useTranslation();
	i18n.changeLanguage();

	function validateName(name) {
		if (name === 'expenses') {
			return 'gasto';
		} else if (name === 'incomes') {
			return 'ingreso';
		}
	}

	return (
		<div className='dark:bg-dark_secondary_color bg-light_secondary_color p-5 rounded-md'>
			{payload.map((p, i) => (
				<p key={i}>
					{localStorage.getItem('filterChartBalance') === 'day' ? (
						<span className='dark:text-white text-black'>
							{t('dashboard.chart')} <span className='font-bold'>{p.payload?.day}</span>
						</span>
					) : (
						<span className='dark:text-white text-black'>El mes de {months[Number(p.payload?.month - 1)]}</span>
					)}
					<span className={`${validateName(p?.name) === 'gasto' ? 'text-alternative_color' : 'text-main_color'} mx-2`}>
						{validateName(p?.name)}
					</span>
					<span className={`${validateName(p?.name) === 'gasto' ? 'text-alternative_color ' : '  text-main_color '} font-bold`}>
						{Number(p.value).toLocaleString()}
					</span>
				</p>
			))}
		</div>
	);
};

export const Chart = ({trigger, filter}) => {
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
				<CartesianGrid strokeDasharray='5 5' vertical={false} strokeLinecap='square' opacity={0.2} />
				<XAxis dataKey='day' />
				<YAxis />
				<Tooltip content={CustomTooltipDaily} />
				<Legend />
				<Line strokeWidth={3} activeDot={{r: 5}} type='bump' dataKey='incomes' stroke={MAIN_COLOR} />
				<Line activeDot={{r: 5}} strokeWidth={3} type='bump' dataKey='expenses' stroke={SECOND_COLOR} />
			</LineChart>
		</ResponsiveContainer>
	);
};
export const ChartDonut = ({trigger}) => {
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
		const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value} = props;
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
				<text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
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
				<path className='hidden md:block' d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill='none' />
				<circle className='hidden md:block' cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
				<text
					className='hidden md:block'
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					textAnchor={textAnchor}
					fontSize={20}
					fontWeight={600}
					fill={`${localStorage.theme === 'dark' ? 'white' : 'black'}`}>{`${value.toLocaleString()}$`}</text>
				<text
					className='hidden md:block'
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fontSize={18}
					fontWeight={600}
					fill='grey'>
					{`${(percent * 100).toFixed(2)}%`}
				</text>

				<text
					className='block md:hidden'
					x={ex + (cos >= 0 ? -35 : 35) * 1}
					y={ey}
					textAnchor={textAnchor}
					fontSize={18}
					fontWeight={600}
					fill={`${localStorage.theme === 'dark' ? 'white' : 'black'}`}>{`${value.toLocaleString()}$`}</text>
				<text
					className='block md:hidden'
					x={ex + (cos >= 0 ? -35 : 35) * 1}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fontSize={16}
					fontWeight={600}
					fill='grey'>
					{`${(percent * 100).toFixed(2)}%`}
				</text>
			</g>
		);
	};

	return (
		<ResponsiveContainer height={330}>
			<PieChart width={600} height={400}>
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
						<Cell key={e.expense_id} fill={COLORS[i % COLORS.length]} />
					))}
				</Pie>

				<Tooltip active={false} />
			</PieChart>
		</ResponsiveContainer>
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
		<ResponsiveContainer height={250}>
			<LineChart
				width={500}
				height={200}
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}>
				<CartesianGrid strokeDasharray='5 5' vertical={false} strokeLinecap='square' opacity={0.2} />
				<XAxis dataKey='name' />
				<YAxis />
				<Legend iconType='star' />

				<Line type='bump' dataKey='ingresos' stroke={MAIN_COLOR} strokeWidth={3} />
				<Line type='bump' dataKey='deudas' stroke='#fe337c' strokeWidth={3} />
			</LineChart>
		</ResponsiveContainer>
	);
};

export const ChartExampleTwo = ({trigger = false}) => {
	const dataExample = [
		{
			name: 'Enero',
			ahorro: 1000,
			deudas: 3000,
		},
		{
			name: 'Febrero',
			ahorro: 5000,
			deudas: 1800,
		},
	];
	if (!localStorage.token) {
		return (
			<ResponsiveContainer height={300}>
				<BarChart
					width={500}
					height={300}
					data={dataExample}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}>
					<CartesianGrid strokeDasharray='5 5' vertical={false} strokeLinecap='square' opacity={0.2} />
					<XAxis dataKey='name' />
					<YAxis />
					<Legend iconType='star' />
					<Bar dataKey='ahorro' fill={MAIN_COLOR} activeBar={<Rectangle fill='pink' stroke='blue' />} />
					<Bar dataKey='deudas' fill={SECOND_COLOR} activeBar={<Rectangle fill='gold' stroke='purple' />} />
				</BarChart>
			</ResponsiveContainer>
		);
	}

	const userInfo = JSON.parse(localStorage.userMain);
	const [goalValue, setGoalValue] = useState<wallet_values>();

	useEffect(() => {
		const getGoalValue = async () => {
			const wallet = await GetWalletUser(userInfo?.user_id);
			setGoalValue(wallet.wallet);
		};
		getGoalValue();
	}, [trigger]);
	const percentageData = [
		{
			name: 'saving',
			saving: goalValue?.saving,
			available: goalValue?.available,
		},
	];

	return (
		<ResponsiveContainer height={300}>
			<BarChart
				width={600}
				height={300}
				data={localStorage.token ? percentageData : dataExample}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}>
				<CartesianGrid strokeDasharray='5 5' vertical={false} strokeLinecap='square' opacity={0.2} />

				<YAxis />
				<Legend />
				{localStorage.token && (
					<>
						<Bar dataKey='saving' fill={SECOND_COLOR} activeBar={<Rectangle fill='#0ef9e2' stroke='purple' />} />
						<Bar dataKey='available' fill={MAIN_COLOR} activeBar={<Rectangle fill='#ff654e' stroke='purple' />} />
					</>
				)}
			</BarChart>
		</ResponsiveContainer>
	);
};
