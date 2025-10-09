REBA: AI-Powered Bank Reconciliation Application
An intelligent, full-stack web application designed to automate the tedious process of bank statement reconciliation. REBA (REconciliation and Bank Analytics) leverages a Python-based AI model to intelligently match transactions, identify anomalies, and generate comprehensive reports, all accessible through a modern and responsive React interface.

This project was built as a real-world task to demonstrate full-stack MERN capabilities integrated with a Python microservice for Ai Firelab.

Key Features
Dual File Upload: Seamlessly upload both bank statements (.csv, .xlsx) and internal transaction ledgers.

AI-Powered Reconciliation: A Python backend service handles the core logic, matching transactions with high accuracy using fuzzy string matching and intelligent categorization.

Anomaly Detection: The AI model flags suspicious or unusual transactions (e.g., potential duplicates, outliers) for manual review.

Dynamic Reporting: View detailed reconciliation results in a clean, user-friendly dashboard with summary cards, charts, and sortable tables.

Persistent Storage: Save generated reports to a MongoDB database for future reference and auditing.

Export Functionality: Export any report to both PDF and Excel formats with a single click.

Fully Deployed: The entire application is live, with the frontend, backend, and AI service deployed as separate, communicating microservices on Render.

Live Demo & Video
Live Application URL: https://reba-ai.onrender.com

Video Walkthrough: https://www.loom.com/share/3ccb917ba79e4b8597ff87c199a7e906?sid=b1ad78d3-d149-4c0f-907e-fa953c45079b

Tech Stack & Architecture
This project is a multi-service application, demonstrating a modern microservice architecture.

[React Frontend] <--> [Node.js/Express API] <--> [Python/FastAPI AI Model]                                                                                                                     
                              |
                      [MongoDB Database]
Category

Technology

Frontend

React.js, Vite, Tailwind CSS, GSAP, Axios

Backend API

Node.js, Express.js, Mongoose

AI Service

Python, FastAPI, Pandas, Scikit-learn, Fuzzywuzzy

Database

MongoDB Atlas

Deployment

Render (Static Site for Frontend, Web Services for Backends)

Local Setup and Installation
To run this project on your local machine, please follow these steps:

Prerequisites:

Node.js (v18 or higher)

Python (v3.9 or higher)

MongoDB Atlas account (or a local MongoDB instance)

Git

1. Clone the Repository

git clone https://github.com/StRuGgLeR-Guts/Bank_Reconciliation.git
cd Bank_Reconciliation

2. Backend API Setup (Terminal 1)

cd backend
npm install

Create a .env file in the backend directory and add the following:

# backend/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
FASTAPI_URL=http://localhost:8001/reconcile/

3. Python AI Service Setup (Terminal 2)

cd logic
# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\Activate 
# Install dependencies
pip install -r requirements.txt

4. Frontend Setup (Terminal 3)

cd frontend
npm install

Create a .env file in the frontend directory and add the following:

# frontend/.env
VITE_API_URL=http://localhost:5000

5. Run the Full Application
You will need three separate terminals running simultaneously.

Terminal 1 (Backend API):

# From the 'backend' folder
npm run dev

Terminal 2 (Python AI Service):

# From the 'logic' folder, with venv active
uvicorn reconciliation_api:app --reload --port 8001

Terminal 3 (Frontend App):

# From the 'frontend' folder
npm run dev

Open your browser to http://localhost:5173 (or whatever port Vite provides).

Deployment Notes
This application is deployed on Render using a multi-service configuration.

Frontend (reba-ai): Deployed as a Static Site.

Build Command: npm install && npm run build

Publish Directory: dist

Backend (reba-ai-backend): Deployed as a Web Service.

Start Command: npm start

Python AI (reba-ai-python): Deployed as a Web Service.

Start Command: uvicorn reconciliation_api:app --host 0.0.0.0 --port 10000

A note on performance: The live application is hosted on Render's free tier. Services automatically "sleep" after inactivity and may experience an initial "cold start" delay of 60-90 seconds on the first request. Subsequent requests will be much faster.

Built by Sanpreeth Ranjith.
