import { motion } from "framer-motion";
import { Edit, Search, Info } from "lucide-react"; // Changed Trash2 to Info
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import MockAdapter from "axios-mock-adapter";

//Mocking the API response
const mock = new MockAdapter(axios);
mock.onGet("https://test.com/getallalerts").reply(200, [
	{
		_id: "1",
		timestamp: "2023-10-01T12:34:56Z",
		message: "SNMP AgentX",
		classification: "Attempted Information Leak",
		priority: 2,
		protocol: "TCP",
		src_ip: "192.168.2.45",
		src_port: 34385,
		dest_ip: "172.28.83.69",
		dest_port: 161,
		packet_length: 128,
		ttl: 64,
		tcp_flags: "SYN",
		llm_reasoning: {
			incident_summary: {
				title: "Suspected SNMP Reconnaissance Attempt",
				description:
					"An unauthorized SNMP request was detected, potentially indicating an attempt to enumerate network devices and gather sensitive information for future exploitation. This activity originates from source IP 172.28.80.1 targeting destination IP 172.28.83.69 on port 161 (SNMP). The classification is 'Attempted Information Leak' with a priority of 2.",
			},
			evidence: {
				log_entry: "[1:1418:11] SNMP request tcp [**]",
				timestamp: "03/13-05:16:50.742306",
				source_ip: "172.28.80.1",
				source_port: 61572,
				destination_ip: "172.28.83.69",
				destination_port: 161,
				protocol: "TCP",
			},
			recommendations: [
				{
					action: "Investigate Source IP",
					details:
						"Determine the legitimacy of the source IP address 172.28.80.1 and its authorized activities on the network.",
				},
				{
					action: "Verify SNMP Configuration",
					details:
						"Review the SNMP configuration on the targeted device (172.28.83.69). Ensure that only authorized devices are permitted to query SNMP information and that the community strings are strong and not default values.  Consider using SNMPv3 for enhanced security.",
				},
				{
					action: "Network Traffic Analysis",
					details:
						"Conduct a thorough analysis of network traffic related to the source and destination IPs to identify any further suspicious activity.",
				},
				{
					action: "Firewall Rule Review",
					details:
						"Assess firewall rules to ensure appropriate restrictions are in place for SNMP traffic, potentially limiting access to specific trusted sources.",
				},
				{
					action: "Vulnerability Scanning",
					details:
						"Regularly scan network devices for vulnerabilities, including those related to SNMP misconfigurations.",
				},
			],
			references: [
				{ source: "NIST SP 800-53r5", control: "SC-7 Network Access Control" },
				{ source: "NIST SP 800-53r5", control: "SI-2 Flaw Remediation" },
			],
		},
	},
	{
		_id: "2",
		timestamp: "2023-10-01T13:45:12Z",
		message: "ICMP Large ICMP Packet",
		classification: "Potentially Bad Traffic",
		priority: 2,
		protocol: "ICMP",
		src_ip: "192.168.2.45",
		src_port: 541,
		dest_ip: "172.28.83.69",
		dest_port: 161,
		packet_length: 256,
		ttl: 128,
		tcp_flags: "",
		llm_reasoning: {
			incident_summary: {
				title: "Suspected SNMP Reconnaissance Attempt",
				description:
					"An unauthorized SNMP request was detected, potentially indicating an attempt to enumerate network devices and gather sensitive information for future exploitation. This activity originates from source IP 172.28.80.1 targeting destination IP 172.28.83.69 on port 161 (SNMP). The classification is 'Attempted Information Leak' with a priority of 2.",
			},
			evidence: {
				log_entry: "[1:1418:11] SNMP request tcp [**]",
				timestamp: "03/13-05:16:50.742306",
				source_ip: "172.28.80.1",
				source_port: 61572,
				destination_ip: "172.28.83.69",
				destination_port: 161,
				protocol: "TCP",
			},
			recommendations: [
				{
					action: "Investigate Source IP",
					details:
						"Determine the legitimacy of the source IP address 172.28.80.1 and its authorized activities on the network.",
				},
				{
					action: "Verify SNMP Configuration",
					details:
						"Review the SNMP configuration on the targeted device (172.28.83.69). Ensure that only authorized devices are permitted to query SNMP information and that the community strings are strong and not default values.  Consider using SNMPv3 for enhanced security.",
				},
				{
					action: "Network Traffic Analysis",
					details:
						"Conduct a thorough analysis of network traffic related to the source and destination IPs to identify any further suspicious activity.",
				},
				{
					action: "Firewall Rule Review",
					details:
						"Assess firewall rules to ensure appropriate restrictions are in place for SNMP traffic, potentially limiting access to specific trusted sources.",
				},
				{
					action: "Vulnerability Scanning",
					details:
						"Regularly scan network devices for vulnerabilities, including those related to SNMP misconfigurations.",
				},
			],
			references: [
				{ source: "NIST SP 800-53r5", control: "SC-7 Network Access Control" },
				{ source: "NIST SP 800-53r5", control: "SI-2 Flaw Remediation" },
			],
		},
	},
	{
		_id: "3",
		timestamp: "2023-10-01T14:56:34Z",
		message: "DDOS mstream",
		classification: "Attempted Denial of Service",
		priority: 1,
		protocol: "UDP",
		src_ip: "192.168.2.45",
		src_port: 36418,
		dest_ip: "172.28.83.69",
		dest_port: 161,
		packet_length: 512,
		ttl: 32,
		tcp_flags: "",
		llm_reasoning: {
			incident_summary: {
				title: "Suspected SNMP Reconnaissance Attempt",
				description:
					"An unauthorized SNMP request was detected, potentially indicating an attempt to enumerate network devices and gather sensitive information for future exploitation. This activity originates from source IP 172.28.80.1 targeting destination IP 172.28.83.69 on port 161 (SNMP). The classification is 'Attempted Information Leak' with a priority of 2.",
			},
			evidence: {
				log_entry: "[1:1418:11] SNMP request tcp [**]",
				timestamp: "03/13-05:16:50.742306",
				source_ip: "172.28.80.1",
				source_port: 61572,
				destination_ip: "172.28.83.69",
				destination_port: 161,
				protocol: "TCP",
			},
			recommendations: [
				{
					action: "Investigate Source IP",
					details:
						"Determine the legitimacy of the source IP address 172.28.80.1 and its authorized activities on the network.",
				},
				{
					action: "Verify SNMP Configuration",
					details:
						"Review the SNMP configuration on the targeted device (172.28.83.69). Ensure that only authorized devices are permitted to query SNMP information and that the community strings are strong and not default values.  Consider using SNMPv3 for enhanced security.",
				},
				{
					action: "Network Traffic Analysis",
					details:
						"Conduct a thorough analysis of network traffic related to the source and destination IPs to identify any further suspicious activity.",
				},
				{
					action: "Firewall Rule Review",
					details:
						"Assess firewall rules to ensure appropriate restrictions are in place for SNMP traffic, potentially limiting access to specific trusted sources.",
				},
				{
					action: "Vulnerability Scanning",
					details:
						"Regularly scan network devices for vulnerabilities, including those related to SNMP misconfigurations.",
				},
			],
			references: [
				{ source: "NIST SP 800-53r5", control: "SC-7 Network Access Control" },
				{ source: "NIST SP 800-53r5", control: "SI-2 Flaw Remediation" },
			],
		},
	},
]);

//Set the app element for accessibility
Modal.setAppElement("#root");

const AlertsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [alerts, setAlerts] = useState([]);
	const [filteredAlerts, setFilteredAlerts] = useState([]);
	const [selectedAlert, setSelectedAlert] = useState(null);
	const [llmReasoning, setLlmReasoning] = useState(null);

	useEffect(() => {
		const fetchAlerts = async () => {
			try {
				const response = await axios.get("https://test.com/getallalerts");
				setAlerts(response.data);
				console.log(response.data);
				setFilteredAlerts(response.data);
			} catch (error) {
				console.error("Error fetching alerts:", error);
			}
		};
		fetchAlerts();
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = alerts.filter(
			(alert) =>
				alert.message.toLowerCase().includes(term) ||
				alert.classification.toLowerCase().includes(term)
		);
		setFilteredAlerts(filtered);
	};

	const handleOpenModal = (alert) => {
		setSelectedAlert(alert);
	};

	const handleCloseModal = () => {
		setSelectedAlert(null);
	};

	const handleOpenLlmModal = (reasoning) => {
		setLlmReasoning(reasoning);
	};

	const handleCloseLlmModal = () => {
		setLlmReasoning(null);
	};

	return (
		<motion.div
			className='bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-900'>Alert List</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search attacks...'
						className='bg-gray-200 text-gray-900 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-500' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-300'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Message
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Classification
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Priority
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Src IP
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Dest IP
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-300'>
						{filteredAlerts.map((alert) => (
							<motion.tr
								key={alert._id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex gap-2 items-center'>
									<img
										src='https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww'
										alt='Alert img'
										className='size-10 rounded-full'
									/>
									{alert.message}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{alert.classification}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{alert.priority}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{alert.src_ip}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{alert.dest_ip}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									<button
										className='text-indigo-600 hover:text-indigo-500 mr-2'
										onClick={() => handleOpenModal(alert)}>
										<Edit size={18} />
									</button>
									<button
										className='text-blue-600 hover:text-blue-500'
										onClick={() => handleOpenLlmModal(alert.llm_reasoning)}>
										<Info size={18} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{selectedAlert && (
				<Modal
					isOpen={!!selectedAlert}
					onRequestClose={handleCloseModal}
					contentLabel='Alert Details'
					style={{
						overlay: {
							backgroundColor: "rgba(0, 0, 0, 0.75)",
							zIndex: 1000,
						},
						content: {
							top: "50%",
							left: "50%",
							right: "auto",
							bottom: "auto",
							marginRight: "-50%",
							transform: "translate(-50%, -50%)",
							width: "80%",
							maxWidth: "600px",
							padding: "20px",
							borderRadius: "10px",
							overflow: "auto", 
							maxHeight: "80vh",
						},
					}}>
					<h2 className='text-xl font-semibold mb-4'>Alert Details</h2>
					<p>
						<strong>Timestamp:</strong> {selectedAlert.timestamp}
					</p>
					<p>
						<strong>Message:</strong> {selectedAlert.message}
					</p>
					<p>
						<strong>Classification:</strong> {selectedAlert.classification}
					</p>
					<p>
						<strong>Priority:</strong> {selectedAlert.priority}
					</p>
					<p>
						<strong>Protocol:</strong> {selectedAlert.protocol}
					</p>
					<p>
						<strong>Source IP:</strong> {selectedAlert.src_ip}
					</p>
					<p>
						<strong>Source Port:</strong> {selectedAlert.src_port}
					</p>
					<p>
						<strong>Destination IP:</strong> {selectedAlert.dest_ip}
					</p>
					<p>
						<strong>Destination Port:</strong> {selectedAlert.dest_port}
					</p>
					<p>
						<strong>Packet Length:</strong> {selectedAlert.packet_length}
					</p>
					<p>
						<strong>TTL:</strong> {selectedAlert.ttl}
					</p>
					<p>
						<strong>TCP Flags:</strong> {selectedAlert.tcp_flags}
					</p>
					<button
						onClick={handleCloseModal}
						className='mt-4 bg-blue-500 text-white px-4 py-2 rounded'>
						Close
					</button>
				</Modal>
			)}

			{llmReasoning && (
				<Modal
					isOpen={!!llmReasoning}
					onRequestClose={handleCloseLlmModal}
					contentLabel='LLM Reasoning'
					style={{
						overlay: {
							backgroundColor: "rgba(0, 0, 0, 0.75)",
							zIndex: 1000,
						},
						content: {
							top: "50%",
							left: "50%",
							right: "auto",
							bottom: "auto",
							marginRight: "-50%",
							transform: "translate(-50%, -50%)",
							width: "80%",
							maxWidth: "600px",
							padding: "20px",
							borderRadius: "10px",
							overflow: "auto", // Make modal scrollable
							maxHeight: "80vh", // Limit modal height
						},
					}}>
					<h2 className='text-xl font-semibold mb-4'>LLM Reasoning</h2>
					<h3 className='text-lg font-semibold'>Incident Summary</h3>
					<p>
						<strong>Title:</strong> {llmReasoning.incident_summary.title}
					</p>
					<p>{llmReasoning.incident_summary.description}</p>
					<h3 className='text-lg font-semibold'>Evidence</h3>
					<p>
						<strong>Log Entry:</strong> {llmReasoning.evidence.log_entry}
					</p>
					<p>
						<strong>Timestamp:</strong> {llmReasoning.evidence.timestamp}
					</p>
					<p>
						<strong>Source IP:</strong> {llmReasoning.evidence.source_ip}
					</p>
					<p>
						<strong>Source Port:</strong> {llmReasoning.evidence.source_port}
					</p>
					<p>
						<strong>Destination IP:</strong>{" "}
						{llmReasoning.evidence.destination_ip}
					</p>
					<p>
						<strong>Destination Port:</strong>{" "}
						{llmReasoning.evidence.destination_port}
					</p>
					<p>
						<strong>Protocol:</strong> {llmReasoning.evidence.protocol}
					</p>
					<h3 className='text-lg font-semibold'>Recommendations</h3>
					{llmReasoning.recommendations.map((rec, index) => (
						<div key={index}>
							<p>
								<strong>Action:</strong> {rec.action}
							</p>
							<p>{rec.details}</p>
						</div>
					))}
					<h3 className='text-lg font-semibold'>References</h3>
					{llmReasoning.references.map((ref, index) => (
						<p key={index}>
							<strong>{ref.source}:</strong> {ref.control}
						</p>
					))}
					<button
						onClick={handleCloseLlmModal}
						className='mt-4 bg-blue-500 text-white px-4 py-2 rounded'>
						Close
					</button>
				</Modal>
			)}
		</motion.div>
	);
};

export default AlertsTable;
