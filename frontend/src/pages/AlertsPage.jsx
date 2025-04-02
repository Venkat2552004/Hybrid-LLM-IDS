import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, Package, ShieldBanIcon, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import AlertsTrendChart from "../components/alerts/AlertsTrendChart";
import AlertsTable from "../components/alerts/AlertsTable";

const AlertsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Alerts' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}>
					<StatCard
						name='Total Attacks'
						icon={Package}
						value={17}
						color='#6366F1'
					/>
					<StatCard
						name='Precossed Attack'
						icon={TrendingUp}
						value={15}
						color='#10B981'
					/>
					<StatCard
						name='In Progress'
						icon={AlertTriangle}
						value={2}
						color='#F59E0B'
					/>
					<StatCard
						name='Blocked'
						icon={ShieldBanIcon}
						value={8}
						color='#EF4444'
					/>
				</motion.div>

				<AlertsTable />

				
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
					<AlertsTrendChart />
					<CategoryDistributionChart />
				</div>
			</main>
		</div>
	);
};
export default AlertsPage;
