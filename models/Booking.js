import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic', required: true },
  selectedDate: { type: Date, required: true },
  message: { type: String, required: false },
  status: { type: String, default: 'Pending' },
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
