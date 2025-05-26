import mongoose from "mongoose";

const mechSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    experience: { type:Number, required: true },
    fee: { type: Number, required: true },
    companies: [{ type: String }],
    image: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
}, { timestamps: true });

const Mech = mongoose.model('Mech', mechSchema);
export default Mech;
