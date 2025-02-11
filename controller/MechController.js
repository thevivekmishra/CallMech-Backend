import bcrypt from 'bcryptjs';
import Mech from '../models/Mech.js';

export const mechRegister = async (req, res) => {
    try {
        const { name, email, password, contact, address, location, experience, fee, companies } = req.body;

        // Check if email already exists
        const existingMech = await Mech.findOne({ email });
        if (existingMech) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

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
        });

        // Save the mechanic to the database
        await newMech.save();
        res.status(201).json({ message: 'Mechanic registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
}

// // Controller to fetch mechanics by company name
// export const getMechanicsByCompany = async (req, res) => {
//     const { companyName } = req.params;

//     try {
//         // Find mechanics associated with the specified company
//         const mechanics = await Mech.find({ companies: companyName });

//         if (mechanics.length === 0) {
//             return res.status(404).json({ message: `No mechanics found for ${companyName}.` });
//         }

//         res.json(mechanics); // Return the list of mechanics for the given company
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Something went wrong. Please try again.' });
//     }
// };




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
