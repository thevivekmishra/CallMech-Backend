import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
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

        // Handle companies field, if it's a string, convert to array
        const companiesArray = companies ? companies.split(',').map(company => company.trim()) : [];

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
            companies: companiesArray,
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

// Mechanic Login Controller
export const loginMechanic = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if mechanic exists
        const mechanic = await Mech.findOne({ email });
        if (!mechanic) {
            return res.status(404).json({ success: false, message: "Mechanic not found" });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, mechanic.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: mechanic._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        res.status(200).json({ success: true, token, mechanic });
    } catch (error) {
        console.error("Mechanic login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Get mechanics based on company
export const getMechanicsByCompany = async (req, res) => {
    const { companyName } = req.params;

    try {
        // Make the company name case-insensitive using regex
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


// Get all mechanics
export const getAllMechanics = async (req, res) => {
    try {
        const mechanics = await Mech.find();
        
        if (mechanics.length === 0) {
            return res.status(404).json({ message: 'No mechanics found.' });
        }

        res.status(200).json(mechanics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

// Delete mechanic by ID
export const deleteMechanic = async (req, res) => {
    try {
        const { id } = req.params;
        const mechanic = await Mech.findByIdAndDelete(id);

        if (!mechanic) {
            return res.status(404).json({ message: "Mechanic not found" });
        }

        res.json({ message: "Mechanic deleted successfully" });
    } catch (error) {
        console.error("Error deleting mechanic:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



