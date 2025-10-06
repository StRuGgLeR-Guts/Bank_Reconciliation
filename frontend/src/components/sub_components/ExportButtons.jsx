import React from 'react';
import { useExport } from '../../Hooks/Export'; // Import the hook

/**
 * --- A Reusable Presentational Button Component ---
 * This button is now fully customizable via props.
 */
const ExportButton = ({ onClick, children, bgColor, hoverBgColor, disabled }) => {
    const baseClasses = "text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-400";
    const colorClasses = `${bgColor} ${hoverBgColor}`;

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${colorClasses}`}>
            {children}
        </button>
    );
};

/**
 * --- A Structural Component Using the Hook and Reusable Button ---
 * This component provides the UI for the export buttons and contains all its own logic.
 */
const ExportControls = ({ exportUrl, data = null }) => {
    // The component uses the imported hook to get all the necessary logic and state.
    const { handleExport, isExporting, exportError } = useExport(exportUrl);

    return (
        <div>
            <div className="flex gap-2">
                <ExportButton
                    onClick={() => handleExport('excel', data)}
                    disabled={isExporting}
                    bgColor="bg-green-600"
                    hoverBgColor="hover:bg-green-700"
                >
                    {isExporting ? 'Exporting...' : 'Export Excel'}
                </ExportButton>
                <ExportButton
                    onClick={() => handleExport('pdf', data)}
                    disabled={isExporting}
                    bgColor="bg-red-600"
                    hoverBgColor="hover:bg-red-700"
                >
                    {isExporting ? 'Exporting...' : 'Export PDF'}
                </ExportButton>
            </div>
            {exportError && <p className="text-red-500 text-sm mt-2">{exportError}</p>}
        </div>
    );
};

export default ExportControls;

