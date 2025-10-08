import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ResultDisplay from '../components/ResultDisplay';

// A simple spinner for loading states, styled for the dark theme
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
    </div>
);

const ReportDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            setError('');
            try {
                const apiURL=import.meta.env.VITE_API_URL
                const response = await axios.get(`${apiURL}/reports/${id}`);
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
        return <p className="text-center text-red-400">{error}</p>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="mb-6">
                <Link to="/reports" className="inline-block bg-white/10 backdrop-blur-lg text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                    &larr; Back to All Reports
                </Link>
            </div>
            
            {report && <ResultDisplay report={report} onReset={() => navigate('/')} />}
        </div>
    );
};

export default ReportDetailPage;

