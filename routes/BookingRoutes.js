import express from 'express';
import { createBooking, deleteBooking, getAllBookingsDetails, getBookingsForMechanic, getBookingsForUser, updateBookingStatus } from '../controller/BookingController.js';

const router = express.Router();

router.post('/create', createBooking);
router.get('/all', getAllBookingsDetails);
router.get('/:mechanicId', getBookingsForMechanic);
router.get('/user/:userId',getBookingsForUser);
router.put('/update-status', updateBookingStatus);
router.delete('/:bookingId', deleteBooking);

export default router;
