REBA: AI-Powered Bank Reconciliation Application
An intelligent, full-stack web application designed to automate the tedious process of bank statement reconciliation. REBA (REconciliation and Bank Analytics) leverages a Python-based AI model to intelligently match transactions, identify anomalies, and generate comprehensive reports, all accessible through a modern and responsive React interface. This project was built as a real-world task to demonstrate full-stack MERN capabilities integrated with a Python microservice.

Key Features
Dual File Upload: Seamlessly upload both bank statements (.csv, .xlsx) and internal transaction ledgers.

AI-Powered Reconciliation: A Python backend service handles the core logic, matching transactions with high accuracy.

Anomaly Detection: The AI model flags suspicious or unusual transactions for manual review.

Dynamic Reporting: View detailed reconciliation results in a clean, user-friendly dashboard with summary cards, charts, and sortable tables.

Persistent Storage: Save generated reports to a MongoDB database for future reference and auditing.

Export Functionality: Export any report to both PDF and Excel formats with a single click.

Fully Deployed: The entire application is live, with the frontend, backend, and AI service deployed as separate, communicating microservices on Render.

Tech Stack & Architecture
This project is a multi-service application, demonstrating a modern microservice architecture.

Architecture Diagram
[React Frontend] <--> [Node.js/Express Backend API] <--> [Python/FastAPI AI Model]
       |                        |
       '-----------------> [MongoDB Database]

Technologies Used
Frontend

Backend (API)

Backend (AI)

Database

Live Demo Link:-
https://reba-ai.onrender.com

Video Demo Link:-
https://www.loom.com/share/3ccb917ba79e4b8597ff87c199a7e906?sid=a7669df8-52d6-403a-ac4c-9b9fe1de8614

Local Setup and Installation
To run this project on your local machine, please follow these steps:

Prerequisites:

Node.js (v18 or higher)

Python (v3.9 or higher)

MongoDB Atlas account (or a local MongoDB instance)

Git

1. Clone the Repository

git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name

2. Backend Setup

cd backend
npm install

# Create a .env file in the 'backend' directory
# and add the following variables:

backend/.env

PORT=5000
MONGO_URI=your_mongodb_connection_string
FASTAPI_URL=http://localhost:8001

3. Python AI Service Setup

cd ../python-service # Or your python folder name
pip install -r requirements.txt

# To run the Python service
uvicorn reconciliation_api:app --host 0.0.0.0 --port 8001

4. Frontend Setup

cd ../frontend
npm install

# Create a .env file in the 'frontend' directory
# and add the following variable:

frontend/.env

VITE_API_URL=http://localhost:5000

5. Run the Application

Run the Python Service: (Terminal 1) uvicorn ...

Run the Backend API: (Terminal 2) cd backend && npm start

Run the Frontend App: (Terminal 3) cd frontend && npm run dev

Deployment on Render
This application is deployed on Render using a multi-service configuration.

Frontend (reba-ai): Deployed as a Static Site.

Build Command: npm install && npm run build

Publish Directory: dist

Backend (reba-ai-backend): Deployed as a Web Service.

Start Command: npm start

Python AI (reba-ai-python): Deployed as a Web Service.

Start Command: uvicorn reconciliation_api:app --host 0.0.0.0 --port 10000

Built by Sanpreeth Ranjith.
