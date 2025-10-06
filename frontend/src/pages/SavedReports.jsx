import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// A simple spinner for loading states
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const SavedReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [page, setPage] = useState(1);
    const reportsPerPage = 10;

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/reports?page=${page}&limit=${reportsPerPage}`);
                setReports(res.data.data);
                setPagination(res.data.pagination);
            } catch (err) {
                setError(err.message || 'Failed to fetch reports from the database.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [page]);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Saved Reconciliation Reports</h2>
            {reports.length === 0 ? (
                <p>No reports have been saved yet.</p>
            ) : (
                <div className="space-y-4">
                    {reports.map((report, index) => (
                        <Link to={`/reports/${report._id}`} key={report._id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <span className="text-lg font-bold text-gray-400 w-8 text-right">
                                {(page - 1) * reportsPerPage + index + 1}.
                            </span>
                            <div className="flex-grow">
                                <p className="font-semibold text-blue-600 text-lg">{report.name}</p>
                                <p className="text-sm text-gray-500">
                                    Saved on: {new Date(report.createdAt).toLocaleString([], {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            <div className="mt-6 flex justify-between items-center">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50">Previous</button>
                <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={!pagination.totalPages || page === pagination.totalPages} className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50">Next</button>
            </div>
        </div>
    );
};

export default SavedReportsPage;

