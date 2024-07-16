import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
	{
		name: 'Jan',
		ingreso: 5000000,
		ahorro: 2000000,
		gasto: 100000,
	},
	{
		name: 'Feb',
		ingreso: 5000000,
		ahorro: 100000,
		gasto: 4000000,
	},
	{
		name: 'Mar',
		ingreso: 5000000,
		ahorro: 5000000,
		gasto: 400,
	},
	{
		name: 'Abril',
		ingreso: 5000000,
		ahorro: 2000000,
		gasto: 800000,
	},
];

const CustomTooltip = ({payload}) => {
	return (
		<div className='custom-tooltip'>
			<p className='payload'>{payload[0]?.value}</p>

			<p className='desc'>Anything you want can be displayed here.</p>
		</div>
	);
};

export const Chart = () => {
	return (
		<ResponsiveContainer
			width='100%'
			height='100%'>
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
				<CartesianGrid strokeDasharray='3 3 3' />
				<XAxis dataKey='name' />
				<YAxis />
				<Tooltip content={CustomTooltip} />
				<Legend />
				<Line
					type='monotone'
					dataKey='ingreso'
					stroke='#36C2CE'
					strokeWidth={1}
				/>
				<Line
					type='monotone'
					dataKey='ahorro'
					stroke='#06D001'
					strokeWidth={1}
				/>
				<Line
					type='monotone'
					dataKey='gasto'
					stroke='#FF0000'
					strokeWidth={1}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};
