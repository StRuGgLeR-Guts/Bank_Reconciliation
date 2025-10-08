import multer from 'multer';

// --- THE FINAL FIX: Use memoryStorage ---
// This tells multer to keep the uploaded file as a buffer in memory,
// which is essential for cloud platforms like Render that have temporary filesystems.
const storage = multer.memoryStorage();

// Configure and export the Multer instance.
export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
