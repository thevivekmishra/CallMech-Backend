import express from 'express';
import { createBooking, getBookingsForMechanic, updateBookingStatus } from '../controller/BookingController.js';

const router = express.Router();

// Route for creating a new booking
router.post('/create', createBooking);

// Route for fetching bookings for a specific mechanic (dashboard)
router.get('/:mechanicId', getBookingsForMechanic);

// Route for updating booking status (approve or cancel)
router.put('/update-status', updateBookingStatus);

export default router;
