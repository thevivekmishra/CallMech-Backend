import express from 'express';
import { createBooking, getUserBookings } from '../controller/BookingController.js'
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Route to create a booking
router.post('/book', authMiddleware, createBooking);

// Route to get all bookings of a user
router.get('/my-bookings', authMiddleware, getUserBookings);

export default router;
