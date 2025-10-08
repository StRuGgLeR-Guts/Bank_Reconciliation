import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// A simple spinner for loading states
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
    </div>
);

const SavedReportsPage = () => {
    const container = React.useRef();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [page, setPage] = useState(1);
    const reportsPerPage = 10;

    useGSAP(() => {
        // --- THE FINAL FIX: Add a condition ---
        // This ensures the animation code only runs when the `reports` array is not empty,
        // which means the report cards are actually in the DOM.
        if (reports.length > 0) {
            gsap.fromTo(".report-card", 
                { 
                    opacity: 0, 
                    y: 50
                }, 
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: ".reports-container",
                        start: "top 85%",
                        toggleActions: "play none none none", 
                    }
                }
            );
        }
    }, { scope: container, dependencies: [reports] });

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
    if (error) return <p className="text-center text-red-400">{error}</p>;

    return (
        <div ref={container} className="w-full max-w-4xl bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">Saved Reconciliation Reports</h2>
            {reports.length === 0 ? (
                <p className="text-gray-300">No reports have been saved yet.</p>
            ) : (
                <div className="space-y-4 reports-container">
                    {reports.map((report, index) => (
                        <Link 
                            to={`/reports/${report._id}`} 
                            key={report._id} 
                            className="report-card flex items-start gap-4 p-4 border border-white/20 rounded-lg hover:bg-white/20 hover:scale-105 transition-all duration-300"
                        >
                            <span className="text-lg font-bold text-gray-400 w-8 text-right">
                                {(page - 1) * reportsPerPage + index + 1}.
                            </span>
                            <div className="flex-grow">
                                <p className="font-semibold text-blue-400 text-lg">{report.name}</p>
                                <p className="text-sm text-gray-400">
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
            <div className="mt-6 flex justify-between items-center text-gray-300">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white/20 rounded-md disabled:opacity-50 hover:bg-white/30">Previous</button>
                <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={!pagination.totalPages || page === pagination.totalPages} className="px-4 py-2 bg-white/20 rounded-md disabled:opacity-50 hover:bg-white/30">Next</button>
            </div>
        </div>
    );
};

export default SavedReportsPage;

