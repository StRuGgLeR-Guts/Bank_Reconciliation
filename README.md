REBA.ai - Intelligent Bank Reconciliation
A full-stack, AI-powered application designed to automate the complex process of bank statement reconciliation. This project was developed as a submission for the Ai Firelab Automation Challenge.

Live Demo URL: [Your Deployed Frontend URL Here]

Video Demo Link: [Link to Your 3-Minute Video Demo Here]

The Problem
Financial controllers and accounting teams spend countless hours manually matching messy bank statements against clean internal records. This process is slow, tedious, and prone to human error, leading to inaccurate financial reporting and wasted resources. Discrepancies in descriptions (AMZN MKTP US*2X4Y6 vs. Amazon Web Services), minor date differences, and potential fraud make automation a significant challenge.

The Solution: REBA.ai
REBA.ai (Reconciliation Bank AI) is an intelligent, full-stack solution that automates this entire workflow. By leveraging a modern microservice architecture and a powerful Python AI engine, it provides a fast, accurate, and auditable reconciliation process, complete with a professional and immersive user interface.

Core Features
REBA.ai is built with a feature set designed to solve real-world financial challenges:

🤖 AI-Powered Transaction Matching: Utilizes a weighted algorithm combining fuzzy string matching, date tolerance, and amount verification to intelligently link bank transactions with internal records, complete with a confidence score for each match.

🔍 Anomaly Detection: Employs a statistical model (Interquartile Range) to learn a vendor's typical spending patterns from historical data and automatically flags suspicious outliers that could indicate fraud or data entry errors.

🧠 ML Auto-Categorization: A scikit-learn classification model is trained on your internal data to predict and assign expense categories to new transactions. The model is saved and reused, improving over time as more data is processed.

🗂️ Persistent Audit Trail: All reconciliation reports can be named and saved to a MongoDB database, creating a complete, paginated history for financial audits and future reference.

📊 Comprehensive Reporting: The frontend dashboard provides a clear, visual breakdown of the reconciliation results, including:

Summary cards for a quick overview.

An interactive pie chart visualizing spending by category.

Paginated  tables for matched, unmatched, and anomalous transactions.

📄 Export Functionality: Users can export both individual reconciliation reports and lists of past reports to Excel and PDF for offline analysis and record-keeping.

✨ Immersive UI/UX: A modern, multi-page interface built with react-router-dom and styled with a "glassmorphism" theme for a professional and visually appealing user experience, complete with subtle GSAP scroll animations.

Technical Architecture
This project uses a scalable microservice architecture to separate concerns and leverage the best tools for each task.

Frontend: A responsive and interactive user interface built with React and styled with Tailwind CSS.

Backend Gateway: A robust Node.js and Express server that handles all user-facing API requests, manages file uploads, generates export files, and communicates with the AI service.

AI Microservice: A dedicated Python service built with FastAPI that performs all the heavy lifting: CSV parsing, AI matching, anomaly detection, and machine learning categorization.

Database: MongoDB (with Mongoose) is used to store all historical reconciliation reports, enabling a persistent audit trail.

Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Node.js (v18 or later)

Python (v3.9 or later)

MongoDB (running locally or a connection string to a cloud instance like Atlas)

1. Backend Setup (Node.js)
# 1. Navigate to the /backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create a .env file in the /backend root and add the following:
#    (Replace with your MongoDB connection string)
MONGO_URI=your_mongodb_connection_string
FASTAPI_URL=http://localhost:8001/reconcile/

# 4. Start the server
npm run dev

2. AI Service Setup (Python)
# 1. Navigate to the /logic directory
cd logic

# 2. Create and activate a virtual environment
# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# On Windows:
python -m venv venv
.\venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Start the FastAPI server 
uvicorn reconciliation_api:app --reload --port 8001

3. Frontend Setup (React)
# 1. Navigate to the /frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the React development server
npm run dev

You can now access the REBA.ai application at http://localhost:5173.

