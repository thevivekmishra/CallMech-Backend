import mongoose from "mongoose";

const mechSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    experience: { type: String, required: true },
    fee: { type: String, required: true },
    companies: [{ type: String }],
    image: {type: String,required: true},
}, { timestamps: true });

const Mech = mongoose.model('Mech', mechSchema);
export default Mech