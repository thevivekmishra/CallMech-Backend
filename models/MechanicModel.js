import mongoose from "mongoose";

const mechanicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    speciality: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    slots_booked: {
        type: Object,
        default: {},
    },
    minimize: {
        type: Boolean,
        default: false,
    },
    createdAt: { // Add this field
        type: Date,
        default: Date.now // Automatically sets to current date/time
    }
});

const mechanicModel = mongoose.models.Mechanic || mongoose.model("Mechanic", mechanicSchema);

export default mechanicModel;
