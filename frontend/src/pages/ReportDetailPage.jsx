import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import ResultDisplay from '../components/resultDisplay';

// A simple spinner for loading states
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const ReportDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize the navigate function
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true); // Ensure loading is true at the start
            setError('');
            try {
                const response = await axios.get(`http://localhost:5000/reports/${id}`);
                setReport(response.data.data.reportData);
            } catch (err) {
                setError('Failed to fetch the report details. It may have been deleted.');
                console.error("Fetch detail error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    // --- FIX: Wrap all content in a single centered container ---
    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 p-4 bg-white rounded-lg shadow-md w-48">
                <Link to="/reports" className="text-blue-600 hover:underline">
                    &larr; Back to all reports
                </Link>
            </div>
            
            {/* The onReset function now uses navigate for smooth SPA navigation */}
            {report && <ResultDisplay report={report} onReset={() => navigate('/')} />}
        </div>
    );
};

export default ReportDetailPage;

