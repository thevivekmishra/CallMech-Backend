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

// Get all bookings for a specific user
export const getBookingsForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find bookings made by the user
        const bookings = await Booking.find({ userId }).populate('mechanicId', 'name email  address city contact image experience fee');

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No bookings found for this user.',
            });
        }

        return res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings.',
        });
    }
};


//Bookig status
export const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;

    if (!['Approved', 'Cancelled', 'Completed'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status update.',
        });
    }

    try {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found.',
            });
        }

        // Handle Expired status (booking is expired after 2 days from selectedDate)
        if (status === 'Expired') {
            const selectedDate = new Date(booking.selectedDate);
            const currentDate = new Date();
            const twoDaysAfter = new Date(selectedDate);
            twoDaysAfter.setDate(selectedDate.getDate() + 2);

            if (currentDate > twoDaysAfter && booking.status !== 'Completed') {
                booking.status = 'Expired';
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Booking cannot be expired before its date or after completion.',
                });
            }
        }

        // Handle Completed status (booking can only be marked as completed within 2 days after selectedDate)
        if (status === 'Completed') {
            const selectedDate = new Date(booking.selectedDate);
            const currentDate = new Date();
            const twoDaysAfter = new Date(selectedDate);
            twoDaysAfter.setDate(selectedDate.getDate() + 2);

            if (currentDate <= twoDaysAfter && booking.status !== 'Completed') {
                booking.status = 'Completed';
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Booking cannot be marked as completed before its date or after the 2-day window.',
                });
            }
        }

        // Handle Approved or Cancelled status
        if (status === 'Approved' || status === 'Cancelled') {
            booking.status = status;
        }

        const updatedBooking = await booking.save();

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



// Get all bookings with full details of the user and mechanic
export const getAllBookingsDetails = async (req, res) => {
    try {
        // Fetch all bookings and populate user and mechanic details
        const bookings = await Booking.find()
            .populate('userId', 'name email mobileNumber')  // Populate user details
            .populate('mechanicId', 'name email mobileNumber expertise'); // Populate mechanic details

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No bookings found',
            });
        }

        return res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error('Error fetching all bookings with details:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings.',
        });
    }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findByIdAndDelete(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking canceled successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel booking.',
        });
    }
};


