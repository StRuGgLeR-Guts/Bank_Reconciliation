import React from "react";
// --- SVG Icons ---
const UploadCloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-blue-600 transition-colors">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>
    </svg>
);
const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-2">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    </svg>
);

const FileUploadBox = ({ title, fileName, onFileChange, inputId }) => {
    // Dynamically change styles based on whether a file is selected
    const baseClasses = "flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-colors";
    const inactiveClasses = "border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50";
    const activeClasses = "border-solid border-green-500 bg-green-50";

    return (
        <label htmlFor={inputId} className={`${baseClasses} ${fileName ? activeClasses : inactiveClasses} group`}>
            {fileName ? (
                <>
                    <FileIcon />
                    <span className="mt-2 text-lg font-medium text-gray-800 text-center break-all">{fileName}</span>
                    <span className="text-sm text-gray-500">Click to change file</span>
                </>
            ) : (
                <>
                    <UploadCloudIcon />
                    <span className="mt-2 text-lg font-medium text-gray-700">{title}</span>
                    <span className="text-sm text-gray-500">Click to select a .csv file</span>
                </>
            )}
            <input id={inputId} type="file" className="hidden" accept=".csv, application/vnd.ms-excel" onChange={onFileChange} />
        </label>
    );
};
export default FileUploadBox