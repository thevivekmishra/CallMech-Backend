// controllers/BookingController.js
import Booking from '../models/Booking.js';
import Mechanic from '../models/Mech.js';
import User from '../models/UserModel.js';

// Create a new booking
export const createBooking = async (req, res) => {
    const { mechanicId, selectedDate, message, userId } = req.body;

    try {
        const newBooking = new Booking({
            mechanicId,
            selectedDate,
            message,
            userId,
        });

        await newBooking.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully!',
            booking: newBooking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking.',
        });
    }
};

// Get all bookings for a specific mechanic (for mechanic's dashboard)
export const getBookingsForMechanic = async (req, res) => {
    const { mechanicId } = req.params;

    try {
        const bookings = await Booking.find({ mechanicId }).populate('userId', 'name email mobileNumber');

        res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings.',
        });
    }
};

// Update booking status (Approve or Cancel)
export const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;

    if (!['Approved', 'Cancelled'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status update.',
        });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: `Booking status updated to ${status}`,
            booking: updatedBooking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status.',
        });
    }
};
