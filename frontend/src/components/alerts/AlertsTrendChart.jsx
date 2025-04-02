import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const alertsData = [
	{ month: "Nov", attacks: 3 },
	{ month: "Dec", attacks: 6 },
	{ month: "Jan", attacks: 7 },
	{ month: "Feb", attacks: 16 },
];

const AlertsTrendChart = () => {
	return (
		<motion.div
			className='bg-white shadow-lg rounded-xl p-6 border border-gray-300'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}>
			<h2 className='text-xl font-semibold text-gray-800 mb-4'>
				Attacks Trend
			</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={alertsData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
						<XAxis dataKey='month' stroke='#4B5563' />
						<YAxis stroke='#4B5563' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.9)",
								borderColor: "#D1D5DB",
							}}
							itemStyle={{ color: "#1F2937" }}
						/>
						<Legend />
						<Line
							type='monotone'
							dataKey='attacks'
							stroke='#6366F1'
							strokeWidth={2}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default AlertsTrendChart;
