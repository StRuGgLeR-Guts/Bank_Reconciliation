import React, { useState } from 'react';
import DocumentUploader from './documentUploader';
import MatchRunner from './matchRunner';
import ResultDisplay from './resultDisplay';

/**
 * Dashboard Component:
 * Acts as the main controller for the UI, deciding what to display.
 * @param {object} report - The final reconciliation report from the API.
 * @param {boolean} loading - True if the API call is in progress.
 * @param {string} error - Any error message from the API call.
 * @param {function} handleReconciliation - The function to call to start the process.
 * 'handleReconciliation' is expected to be passed down from a parent component (like App.jsx).
 * @param {function} handleReset - The function to call to reset the UI to its initial state.
 */
const Dashboard = ({ report, loading, error, handleReconciliation, handleReset }) => {
    // Local state to track selected files before sending them to the parent.
    const [bankFile, setBankFile] = useState(null);
    const [internalFile, setInternalFile] = useState(null);
    const [formError, setFormError] = useState('');

    // This function is passed to MatchRunner. It validates file selection
    // before calling the main reconciliation handler from the parent.
    const handleRun = () => {
        if (!bankFile || !internalFile) {
            setFormError("Please select both files before reconciling.");
            return;
        }
        setFormError('');
        handleReconciliation(bankFile, internalFile);
    };

    // --- Conditional Rendering Logic ---

    // If a report exists, we only show the results.
    if (report) {
        return <ResultDisplay report={report} onReset={handleReset} />;
    }

    // Otherwise, show the initial upload interface.
    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <DocumentUploader 
                onBankFileSelect={setBankFile} 
                onInternalFileSelect={setInternalFile} 
            />
            <MatchRunner 
                onRun={handleRun}
                loading={loading}
                error={error || formError} // Show API error or local form error
                filesSelected={!!bankFile && !!internalFile}
            />
        </div>
    );
};

export default Dashboard;

