import React, { useState } from 'react';
import FileUploadBox from './sub_components/FileUploadBox';



// --- Reusable Sub-component for the Upload Box ---



/**
 * DocumentUploader Component:
 * Manages the UI for uploading bank and internal record files.
 * @param {function} onBankFileSelect - Callback with the selected bank file object.
 * @param {function} onInternalFileSelect - Callback with the selected internal file object.
 */
const DocumentUploader = ({ onBankFileSelect, onInternalFileSelect }) => {
    const [bankFileName, setBankFileName] = useState('');
    const [internalFileName, setInternalFileName] = useState('');

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (file) {
            if (fileType === 'bank') {
                setBankFileName(file.name);
                onBankFileSelect(file);
            } else {
                setInternalFileName(file.name);
                onInternalFileSelect(file);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadBox 
                title="Bank Statement (.csv)"
                fileName={bankFileName}
                onFileChange={(e) => handleFileChange(e, 'bank')}
                inputId="bank-file-input"
            />
            <FileUploadBox 
                title="Internal Records (.csv)"
                fileName={internalFileName}
                onFileChange={(e) => handleFileChange(e, 'internal')}
                inputId="internal-file-input"
            />
        </div>
    );
};

export default DocumentUploader;

