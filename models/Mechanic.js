import mongoose from "mongoose";

const mechanicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    experience: { type: String, required: true },
    fee: { type: String, required: true },
    companies: [{ type: String }],
}, { timestamps: true });

const Mechanic = mongoose.model('Mechanic', mechanicSchema);
module.exports = Mechanic;
