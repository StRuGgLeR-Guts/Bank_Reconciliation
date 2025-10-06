import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import axios from 'axios';
import { Link } from "react-router-dom";

// Assuming these are now in a sub_components folder
import TransactionsTable from './sub_components/TransactionsTable';
import CategoryChart from './sub_components/CategoryChart';
import SummaryCard from './sub_components/SummaryCard';
import ExportControls from './sub_components/exportButtons';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// --- SVG Icons ---
const AlertTriangleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> );
const CheckCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 inline-block mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> );

// --- Formatting Helper ---
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const ResultDisplay = ({ report, }) => { 
    // --- State for saving the report ---
    const [reportName, setReportName] = useState(`Reconciliation - ${new Date().toLocaleDateString()}`); 
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [saveError, setSaveError] = useState('');

    // --- Handler for Saving the Report to MongoDB ---
    const handleSaveReport = async () => {
        if (!reportName.trim()) {
            setSaveError('Please provide a name for the report.');
            return;
        }
        setIsSaving(true);
        setSaveError('');
        try {
            await axios.post('http://localhost:5000/reports', {
                name: reportName,
                reportData: report,
            });
            setIsSaved(true);
        } catch (error) {
            setSaveError(error.response?.data?.message || 'Failed to save report.');
            console.error('Save report failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    
    return (
        <div className="w-full max-w-5xl">

            {/* --- Navigation & Export Section --- */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 p-4 bg-white rounded-lg shadow-md w-2xs">
                {/* --- INTEGRATED EXPORT CONTROLS --- */}
                <ExportControls 
                    exportUrl="http://localhost:5000/export" 
                    data={report} 
                />
            </div>


            {/* --- Save Report Section --- */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Save Reconciliation</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input
                        type="text"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        placeholder="Enter report name"
                        className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSaved}
                    />
                    <button
                        onClick={handleSaveReport}
                        className="w-full sm:w-auto bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isSaving || isSaved}
                    >
                        {isSaving ? 'Saving...' : (isSaved ? <><CheckCircleIcon /> Saved</> : 'Save Report')}
                    </button>
                </div>
                {saveError && <p className="text-red-500 text-sm mt-2">{saveError}</p>}
                {isSaved && !saveError && <p className="text-green-600 text-sm mt-2">This report has been saved to the database.</p>}
            </div>

            {/* Summary Cards, Chart, and Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard title="Matched" value={report.summary.matched_count} colorClass="text-green-600" />
                <SummaryCard title="Anomalies" value={report.summary.anomaly_count} colorClass="text-red-600" />
                <SummaryCard title="Unmatched (Bank)" value={report.summary.unmatched_bank_count} colorClass="text-yellow-600" />
            </div>
            
            <CategoryChart categoryData={report.category_summary} />

            {report.anomalies_detected?.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md mt-8">
                    <div className="flex items-center"> <AlertTriangleIcon /> <h3 className="text-xl font-semibold text-red-800 ml-3">Anomalies Detected for Review</h3> </div>
                    <ul className="list-disc pl-5 mt-4 space-y-2 text-red-700">
                        {report.anomalies_detected.map((anomaly, i) => (
                            <li key={i}> <strong>{anomaly.Date}:</strong> A charge of <strong>{formatCurrency(anomaly.Amount)}</strong> for "{anomaly.Description}" was flagged. <br /> <span className="text-sm italic">{anomaly.Flagged_Reason}</span> </li>
                        ))}
                    </ul>
                </div>
            )}
            <TransactionsTable title="Matched Transactions" data={report.matched_transactions.map(t => ({ date: t.bank.Date, description: t.bank.Description, amount: formatCurrency(t.bank.Amount), vendor: t.internal.Vendor, confidence: `${t.confidence}%` }))} columns={[ { header: 'Date', key: 'date' }, { header: 'Bank Description', key: 'description' }, { header: 'Amount', key: 'amount' }, { header: 'Matched Vendor', key: 'vendor' }, { header: 'Confidence', key: 'confidence' }, ]} />
            <TransactionsTable title="Unmatched Bank Transactions" data={report.unmatched_bank_transactions.map(t => ({ ...t, Amount: formatCurrency(t.Amount) }))} columns={[ { header: 'Date', key: 'Date' }, { header: 'Description', key: 'Description' }, { header: 'Amount', key: 'Amount' } ]} />
            <TransactionsTable title="Unmatched Internal Records" data={report.unmatched_internal_records.map(t => ({ ...t, Amount: formatCurrency(t.Amount) }))} columns={[ { header: 'Date', key: 'Date' }, { header: 'Vendor', key: 'Vendor' }, { header: 'Amount', key: 'Amount' } ]} />
        </div>
    );
}

export default ResultDisplay;

