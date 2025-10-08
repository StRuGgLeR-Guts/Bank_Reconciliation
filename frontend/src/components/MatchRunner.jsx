import React from 'react';

// --- SVG Loading Spinner ---
// Styled for the dark theme
const LoadingSpinner = () => (
    <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

/**
 * MatchRunner Component:
 * Displays a button to start the reconciliation process.
 * Manages UI states for loading and errors.
 * @param {function} onRun - Callback function to execute when the button is clicked.
 * @param {boolean} loading - If true, displays a loading spinner.
 * @param {string} error - If present, displays an error message.
 * @param {boolean} filesSelected - If true, the run button is enabled.
 */
const MatchRunner = ({ onRun, loading, error, filesSelected }) => {
    return (
        <>
            {error && (
                <div className="mt-6 bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                    <p className="font-bold">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            
            {/* Submit Button or Loading Spinner */}
            <div className="mt-8 text-center">
                {loading ? (
                    <div className="flex flex-col items-center justify-center" aria-live="polite" aria-busy="true">
                        <LoadingSpinner />
                        <p className="mt-4 text-gray-300">Reconciling... this may take a moment.</p>
                    </div>
                ) : (
                    <button 
                        onClick={onRun}
                        disabled={!filesSelected || loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-500/50 disabled:cursor-not-allowed"
                    >
                        Run Reconciliation
                    </button>
                )}
            </div>
        </>
    );
};

export default MatchRunner;
