# Hybrid-LLM Intrusion Detection System (IDS)

## Overview
The **Hybrid-LLM IDS** enhances cybersecurity by integrating a traditional **Snort-based intrusion detection system** with a **Large Language Model (LLM)** to analyze and detect **unknown threats** in real-time. Snort detects known attacks, while the LLM identifies and explains new, evolving threats.

## Features
- **Real-Time Log Monitoring:** Continuously monitors Snort logs for intrusion alerts.
- **AI-Powered Anomaly Detection:** Uses LLM to analyze and classify unknown attacks.
- **Automated API Communication:** Extracts relevant attack details and sends them to the LLM for processing.
- **Admin Dashboard:** Displays attack statistics, severity levels, and LLM-generated insights.
- **Database Integration:** Stores detected threats and LLM responses in MongoDB for future reference.

## Tech Stack
- **Backend:** Python, Flask, Snort
- **AI & Processing:** OpenAI API (or a custom LLM), NLP Techniques
- **Database:** MongoDB
- **Frontend:** React.js, Tailwind CSS
- **Deployment:** Docker, Linux (Ubuntu)

## Installation & Setup
### Prerequisites
- Python 3.x
- Node.js and npm
- MongoDB
- Snort IDS

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/hybrid-llm-ids.git
cd hybrid-llm-ids/backend

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start the frontend server
npm run dev
```

### Running Snort
```bash
sudo snort -A fast -q -c /etc/snort/snort.conf -i eth0
```

## Usage
1. **Monitor Attacks:** Snort detects incoming threats and logs alerts.
2. **AI Analysis:** The system extracts relevant details and sends them to the LLM for classification.
3. **Admin Dashboard:** View real-time attack insights, severity levels, and explanations.

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/alerts` | Fetch all detected attacks |
| POST | `/analyze` | Send attack data to LLM for analysis |
| GET | `/dashboard` | Retrieve attack statistics |

## Future Enhancements
- Enhance LLM accuracy using fine-tuned security datasets.
- Implement real-time alert notifications.
- Extend support for additional IDS tools.

## License
This project is licensed under the MIT License.

## Team Members
- **Venkata Mahesh Polumuri(ME)** - [venkat2552004](https://github.com/venkat2552004)
- **Hemanth Vemulapalli** - [hemanthv11](https://github.com/hemanthv11)
- **Shashank S Pothula** - [shinytornado](https://github.com/shinytornado)
- **Lakshman Tangella** - [](https://github.com/)
