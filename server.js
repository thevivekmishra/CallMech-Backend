import express from 'express';
import connectDB from './config/DatabaseConfig.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectCloudinary from './config/Cloudinary.js';
import adminRouter from './routes/AdminRoute.js';
import authRoutes from './routes/AuthRoute.js'
import mech from './routes/Mech.js'
import dotenv from 'dotenv';
dotenv.config();

// Initialize express app
const app = express();

// Set up middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for cross-origin requests


// Connect to MongoDB /cloudinary
connectDB();
connectCloudinary();

//routes/endpoints
app.use("/api/admin",adminRouter)
app.use('/api/auth', authRoutes);
app.use("/api/mech",mech)

// Define routes (example route)
app.get('/', (req, res) => {
  res.send('Hello from CallMech......');
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
