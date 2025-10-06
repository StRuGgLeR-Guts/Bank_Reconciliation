import { useState } from 'react';
import axios from 'axios';

/**
 * A custom hook to handle the logic for exporting data and downloading files.
 * It's reusable for any export endpoint in your application.
 * @param {string} exportUrl - The API endpoint to call for the export.
 */
export const useExport = (exportUrl) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState(null);

    /**
     * Triggers the export process.
     * @param {string} type - The type of file to export ('excel' or 'pdf').
     * @param {object|null} data - Optional data payload to send (for POST requests).
     */
    const handleExport = async (type, data = null) => {
        setIsExporting(true);
        setExportError(null);
        try {
            const method = data ? 'post' : 'get';
            const url = `${exportUrl}?type=${type}`;

            const response = await axios({
                method,
                url,
                data,
                responseType: 'blob',
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;

            const contentDisposition = response.headers['content-disposition'];
            let filename = `export.${type === 'excel' ? 'xlsx' : 'pdf'}`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

        } catch (err) {
            console.error(`Failed to export as ${type}`, err);
            setExportError(`Failed to generate ${type.toUpperCase()} file. Please check server logs.`);
        } finally {
            setIsExporting(false);
        }
    };

    return { handleExport, isExporting, exportError };
};

