import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './db/mongoose.js'
import router from './routes/router.js'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

connectDB();
app.use(router)

app.listen(PORT, () => {
    console.log(`Node Server is running on port ${PORT}`);
});