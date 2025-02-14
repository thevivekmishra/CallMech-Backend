import Booking from '../models/Booking.js';
import User from '../models/UserModel.js'; // Assuming you have a User model

// Create a booking
export const createBooking = async (req, res) => {
  const { mechanicId, selectedDate, message } = req.body;
  const userId = req.user.id; // Assuming user is authenticated and user id is in req.user

  try {
    const newBooking = new Booking({
      userId,
      mechanicId,
      selectedDate,
      message,
    });

    await newBooking.save();
    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings for a user
export const getUserBookings = async (req, res) => {
  const userId = req.user.id; // Assuming user is authenticated and user id is in req.user

  try {
    const bookings = await Booking.find({ userId }).populate('mechanicId');
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
