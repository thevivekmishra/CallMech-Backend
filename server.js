import express from 'express';
import connectDB from './config/DatabaseConfig.js';
import cors from 'cors';
import connectCloudinary from './config/Cloudinary.js';
import adminRouter from './routes/AdminRoute.js';
import authRoutes from './routes/UserRoute.js'
import mech from './routes/Mech.js'
import dotenv from 'dotenv';
import mailRoutes from './routes/MailRoutes.js'
import bookingRoute from './routes/BookingRoutes.js'
dotenv.config();

// Initialize express app
const app = express();

// Set up middleware
app.use(express.json()); 
app.use(cors()); 


// Connect to MongoDB /cloudinary
connectDB();
connectCloudinary();

//routes/endpoints
app.use("/api/admin",adminRouter);
app.use('/api/auth', authRoutes);
app.use("/api/mech",mech)
app.use("/api/mail",mailRoutes)
app.use('/api/bookings',bookingRoute); 


app.get('/', (req, res) => {
  res.send('Hello from CallMech......');
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});