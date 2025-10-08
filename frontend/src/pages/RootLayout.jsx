import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from "gsap";
import axios from 'axios';

const RootLayout = () => {
    useGSAP(() => {
        gsap.set('.head-title, .head-subtitle', { y: -30, autoAlpha: 0 });
        gsap.set('.buttons', { y: 20, autoAlpha: 0 });

        gsap.to('.head-title', { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out', delay: 0.2 });
        gsap.to('.head-subtitle', { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out', delay: 0.4 });
        gsap.to('.buttons', { y: 0, autoAlpha: 1, duration: 0.8, delay: 0.6, ease: 'power2.out' });
    }, []);

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filesToProcess, setFilesToProcess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!filesToProcess) return;
        const processFiles = async () => {
            setLoading(true);
            setError('');
            setReport(null);
            const formData = new FormData();
            formData.append('bankStatement', filesToProcess.bankFile);
            formData.append('internalRecords', filesToProcess.internalFile);
            try {
                const response = await axios.post('http://localhost:5000/reconcile', formData);
                setReport(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false);
                setFilesToProcess(null);
            }
        };
        processFiles();
    }, [filesToProcess]);

    const handleReconciliation = (bankFile, internalFile) => {
        setFilesToProcess({ bankFile, internalFile });
    };

    const handleReset = () => {
        setReport(null);
        setError('');
        setLoading(false);
        navigate('/');
    };

    return (
        <main className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 min-h-screen p-4 sm:p-8 flex flex-col w-full">
            <header className="text-center mb-8 w-full">
                <h1 className="text-4xl font-bold text-white head-title">REBA.ai</h1>
                <p className="text-lg text-gray-300 mt-2 head-subtitle">Intelligent Bank Reconciliation Tool</p>
            </header>
            
            <nav className="mb-8 bg-white/10 backdrop-blur-lg p-2 rounded-lg shadow-lg flex justify-center gap-2 mx-auto buttons">
                <NavLink 
                    to="/"
                    onClick={handleReset} 
                    className={({ isActive }) => 
                        `px-4 py-2 rounded-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-white/20'}`
                    }
                    end
                >
                    New Reconciliation
                </NavLink>
                <NavLink 
                    to="/reports" 
                    className={({ isActive }) => 
                        `px-4 py-2 rounded-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-white/20'}`
                    }
                >
                    Past Reports
                </NavLink>
            </nav>

            <div className="w-full max-w-5xl mx-auto">
                 <Outlet context={{ report, loading, error, handleReconciliation, handleReset }} />
            </div>
        </main>
    );
};

export default RootLayout;

