import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Dashboard from '../components/dashBoard'; // Assuming this is your main dashboard component

const UploadLayout = () => {
    // --- This component now gets all its props from the RootLayout ---
    const { report, loading, error, handleReconciliation, handleReset } = useOutletContext();

    // The page is now just a simple wrapper around your existing Dashboard component
    return (
        <Dashboard
            report={report}
            loading={loading}
            error={error}
            handleReconciliation={handleReconciliation}
            handleReset={handleReset}
        />
    );
};

export default UploadLayout;
