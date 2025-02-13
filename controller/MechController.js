import bcrypt from 'bcryptjs';
import Mech from '../models/Mech.js';
import { v2 as cloudinary } from 'cloudinary';

export const mechRegister = async (req, res) => {
    try {
        const { name, email, password, contact, address, location, experience, fee, companies } = req.body;
        const imageFile = req.file;  // Make sure req.file is getting populated from Multer

        if (!imageFile) {
            return res.status(400).json({ error: 'Image is required.' });
        }

        // Check if email already exists
        const existingMech = await Mech.findOne({ email });
        if (existingMech) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageURL = imageUpload.secure_url;

        // Create a new mechanic instance
        const newMech = new Mech({
            name,
            email,
            password: hashedPassword,
            contact,
            address,
            location,
            experience,
            fee,
            companies,
            image: imageURL  // Save the Cloudinary image URL in the DB
        });

        // Save the mechanic to the database
        await newMech.save();
        res.status(201).json({ message: 'Mechanic registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};



export const getMechanicsByCompany = async (req, res) => {
    const { companyName } = req.params;

    try {
        // Make the company name case-insensitive by using regex
        const mechanics = await Mech.find({
            companies: { $elemMatch: { $regex: new RegExp(`^${companyName}$`, 'i') } }
        });

        if (mechanics.length === 0) {
            return res.status(404).json({ message: `No mechanics found for ${companyName}.` });
        }

        res.json(mechanics); // Return the list of mechanics for the given company
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};
