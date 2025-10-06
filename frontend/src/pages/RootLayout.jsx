import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RootLayout = () => {
    // --- State is now "lifted up" to this parent component ---
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filesToProcess, setFilesToProcess] = useState(null);
    const navigate = useNavigate();

    // The API call logic now lives in the layout
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

    // This function resets the state, effectively clearing the page
    const handleReset = () => {
        setReport(null);
        setError('');
        setLoading(false);
        // Ensure we are on the homepage when resetting
        navigate('/');
    };

    return (
        <main className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center w-full">
            <header className="text-center mb-8 w-full">
                <h1 className="text-4xl font-bold text-gray-800">RIBA.ai</h1>
                <p className="text-lg text-gray-600 mt-2">Intelligent Bank Reconciliation</p>
            </header>
            
            <nav className="mb-8 bg-white p-2 rounded-lg shadow-md flex justify-center gap-2">
                {/* --- FIX: Changed back to NavLink, but now with an onClick handler --- */}
                <NavLink 
                    to="/"
                    onClick={handleReset} // This now clears the state
                    className={({ isActive }) => 
                        `px-4 py-2 rounded-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`
                    }
                    end
                >
                    New Reconciliation
                </NavLink>
                <NavLink 
                    to="/reports" 
                    className={({ isActive }) => 
                        `px-4 py-2 rounded-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`
                    }
                >
                    Past Reports
                </NavLink>
            </nav>

            <div className="w-full max-w-5xl mx-auto">
                 {/* The state and handlers are passed down to the child page via context */}
                 <Outlet context={{ report, loading, error, handleReconciliation, handleReset }} />
            </div>
        </main>
    );
};

export default RootLayout;

