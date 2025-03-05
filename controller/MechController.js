import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import Mech from '../models/Mech.js';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/UserModel.js';
import sendEmail from './MailController.js';  

export const mechRegister = async (req, res) => {
    try {
        const { name, email, password, contact, address, location, experience, fee, companies } = req.body;
        const imageFile = req.file;  // Make sure req.file is getting populated from Multer

        if (!imageFile) {
            return res.status(400).json({ error: 'Image is required.' });
        }

        // Check if email already exists
        const existingMech = await Mech.findOne({ email });
        const existingUser = await User.findOne({ email });

        if (existingMech) {
            return res.status(400).json({ error: 'Email already registered as a Mechanic.' });
        }
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered as a User.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageURL = imageUpload.secure_url;

        // Handle companies field, if it's a string, convert to array
        const companiesArray = companies ? companies.split(',').map(company => company.trim()) : [];

        // Create a verification token
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

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
            image: imageURL,
            isVerified: false, 
            verificationToken, 
        });

        // Save the mechanic to the database
        await newMech.save();

        // Send the verification email
        const verificationLink = `${process.env.SERVER_URL}/api/mech/verify-email?token=${verificationToken}`;
        const emailMessage = `Please click the following link to verify your email: ${verificationLink}`;
        await sendEmail({
            email,
            subject: "Verify Your Email Address",
            message: emailMessage,
        });

        res.status(201).json({
            message: 'Mechanic registered successfully. Please check your email for verification.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

export const verifyMechanicEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Verification token is missing' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find the mechanic by email
        const mechanic = await Mech.findOne({ email: decoded.email });
        if (!mechanic) {
            return res.status(400).json({ message: 'Mechanic not found' });
        }

        // Check if the mechanic is already verified
        if (mechanic.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Update the mechanic's verification status
        mechanic.isVerified = true;
        mechanic.verificationToken = undefined; // Clear the token after verification
        await mechanic.save();

        res.status(200).json({ message: 'Mechanic email successfully verified. You can now log in.' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid or expired verification token' });
    }
};

// Get mechanics based on company
export const loginMechanic = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if mechanic exists by email
        const mechanic = await Mech.findOne({ email });
        if (!mechanic) {
            return res.status(404).json({ success: false, message: "Mechanic not found" });
        }

        // Check if the mechanic has verified their email
        if (!mechanic.isVerified) {
            return res.status(400).json({ success: false, message: "Please verify your email before logging in" });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, mechanic.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: mechanic._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        res.status(200).json({ success: true, token, mechanicId: mechanic._id, mechanic });
    } catch (error) {
        console.error("Mechanic login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

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



// Get the details of the currently logged-in mechanic
export const getMechProfile = async (req, res) => {
    try {
        // Assuming the JWT token contains the mechanic's ID as 'id'
        const mechanicId = req.user.id; // req.user comes from the authentication middleware
        
        // Find mechanic by ID
        const mechanic = await Mech.findById(mechanicId);

        if (!mechanic) {
            return res.status(404).json({ message: 'Mechanic not found.' });
        }

        res.json(mechanic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};



