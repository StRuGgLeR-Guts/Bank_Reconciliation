import multer from 'multer';
import path from 'path';

// Define the directory for uploads relative to the project root
const UPLOAD_DIR = path.resolve('uploads');

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // NOTE: Ensure the 'uploads/' folder exists!
        cb(null, UPLOAD_DIR); 
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
    }
});

// Configure Multer instance for single file handling
export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// We only need to export the configured 'upload' object
// No need for a default export since we are exporting a named constant.