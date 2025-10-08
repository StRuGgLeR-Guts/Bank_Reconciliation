import React from 'react';
import { useExport } from '../../Hooks/Export'; 

// --- NEW: SVG Icons for the buttons ---
const ExcelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line>
    </svg>
);

const PdfIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 11.5v-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5z"></path><path d="M17 11.5v5"></path><path d="M14 11.5h1.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H14"></path>
    </svg>
);


/**
 * --- A Reusable Presentational Button Component ---
 */
const ExportButton = ({ onClick, children, bgColor, hoverBgColor, disabled, icon }) => {
    const baseClasses = "text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500/50 disabled:cursor-not-allowed flex items-center justify-center border border-white/20 transform hover:-translate-y-1";
    const colorClasses = `${bgColor} ${hoverBgColor}`;

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${colorClasses}`}>
            {icon}
            {children}
        </button>
    );
};

/**
 * --- A Structural Component Using the Hook and Reusable Button ---
 * This component provides the UI for the export buttons.
 */
const ExportControls = ({ exportUrl, data = null }) => {
    const { handleExport, isExporting, exportError } = useExport(exportUrl);

    return (
        <div>
            <div className="flex gap-2">
                <ExportButton
                    onClick={() => handleExport('excel', data)}
                    disabled={isExporting}
                    icon={<ExcelIcon />}
                    bgColor="bg-green-600/70"
                    hoverBgColor="hover:bg-green-600"
                >
                    {isExporting ? 'Exporting...' : 'Excel'}
                </ExportButton>
                <ExportButton
                    onClick={() => handleExport('pdf', data)}
                    disabled={isExporting}
                    icon={<PdfIcon />}
                    bgColor="bg-red-600/70"
                    hoverBgColor="hover:bg-red-600"
                >
                    {isExporting ? 'Exporting...' : 'PDF'}
                </ExportButton>
            </div>
            {exportError && <p className="text-red-400 text-sm mt-2 text-center">{exportError}</p>}
        </div>
    );
};

export default ExportControls;

