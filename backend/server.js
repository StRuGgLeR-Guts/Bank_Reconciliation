import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './db/mongoose.js'
import router from './routes/router.js'

const app = express();
const PORT = process.env.PORT || 5000;


// --- START OF THE CORS FIX ---
// This tells your server which websites are allowed to make requests.
const allowedOrigins = [
    'https://reba-ai-frontend.onrender.com', // Your live frontend URL
    'http://localhost:5173'                  // Your local frontend URL for testing
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('This request was blocked by CORS.'));
        }
    }
};

// Replace the simple app.use(cors()) with this new, specific configuration.
app.use(cors(corsOptions));
// --- END OF THE CORS FIX ---


app.use(express.json()); 

connectDB();
app.use(router)

app.listen(PORT, () => {
    console.log(`Node Server is running on port ${PORT}`);
});

