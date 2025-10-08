import React, { useState } from 'react';
import DocumentUploader from './DocumentUploader';
import MatchRunner from './MatchRunner';
import ResultDisplay from './ResultDisplay';

const Dashboard = ({ report, loading, error, handleReconciliation, handleReset }) => {
    const [bankFile, setBankFile] = useState(null);
    const [internalFile, setInternalFile] = useState(null);
    const [formError, setFormError] = useState('');

    const handleRun = () => {
        if (!bankFile || !internalFile) {
            setFormError("Please select both files before reconciling.");
            return;
        }
        setFormError('');
        handleReconciliation(bankFile, internalFile);
    };

    if (report) {
        return <ResultDisplay report={report} onReset={handleReset} />;
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg">
            <DocumentUploader 
                onBankFileSelect={setBankFile} 
                onInternalFileSelect={setInternalFile} 
            />
            <MatchRunner 
                onRun={handleRun}
                loading={loading}
                error={error || formError}
                filesSelected={!!bankFile && !!internalFile}
            />
        </div>
    );
};

export default Dashboard;
