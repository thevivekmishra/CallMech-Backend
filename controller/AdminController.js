import validator from 'validator';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import mechanicModel from '../models/MechanicModel.js';
import jwt from 'jsonwebtoken'

// API for adding mechanic
const addMechanic = async (req, res) => {
    try {
        const { name, email, password, speciality, company, experience, about, fee, address, available } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !speciality || !company || !experience || !about || !fee || !address || !available) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validating email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or incorrect email id"
            });
        }

        // Validating password strength
        if (password.length < 4) {
            return res.status(400).json({
                success: false,
                message: "Please enter a strong password"
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageURL = imageUpload.secure_url;

        // Save data in database
        const mechanicData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            company,
            experience,
            about,
            fee,
            address,
            available,
            date: Date.now(),
            image: imageURL,
        };
        const newMechanic = new mechanicModel(mechanicData);
        await newMechanic.save();

        return res.status(200).json({
            success: true,
            message: "Mechanic added successfully"
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: "Something went wrong while adding mechanic please check email"
        });
    }
};

// API for admin login 
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate admin credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Generate token with concatenated string of email and password
            const token = jwt.sign(email + password, process.env.JWT_SECRET_KEY);
            return res.json({
                success: true,
                token
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

//API for getting all mechanic
const allMechanic = async (req, res) => {
    try {
        const mechanic = await mechanicModel.find({}).select("-password")
        return res.status(200).json({
            success: true,mechanic,
            message: "Data fetched successfully "
        })
    }
    catch (error) {
        // console.log(error)
        return res.status(400).json({
            success: false,
            message: "Failed to load all mechanic"
        })
    }
}


export { addMechanic, loginAdmin, allMechanic };