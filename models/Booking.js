// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        mechanicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mech', 
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        selectedDate: {
            type: Date,
            required: true,
        },
        message: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
