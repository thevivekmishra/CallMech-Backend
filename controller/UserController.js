import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import sendEmail from './MailController.js';
import Mech from '../models/Mech.js';

export const signup = async (req, res) => {
  const { name, email, password, confirmPassword, mobileNumber } = req.body;

  // Validate passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  const existingMech = await Mech.findOne({email});
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  if (existingMech) {
    return res.status(400).json({ message: 'Email already registered as a Mechanic' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create a verification token
  const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

  // Create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    mobileNumber,
    verificationToken,
  });

  try {
    // Save the user to DB (user is not verified yet)
    await newUser.save();

    // Send the verification email
    const verificationLink = `${process.env.SERVER_URL}/api/auth/verify-email?token=${verificationToken}`;
    const emailMessage = `Please click the following link to verify your email: ${verificationLink}`;
    await sendEmail({
      email,
      subject: "Verify Your Email Address",
      message: emailMessage,
    });

    res.status(200).json({
      message: 'User registered successfully. Please check your email for verification.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find the user by email
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Update the user's verification status
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token after verification
    await user.save();

    res.status(200).json({ message: 'Email successfully verified. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired verification token' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Check if the email is verified
  if (!user.isVerified) {
    return res.status(400).json({ message: 'Please verify your email before logging in' });
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  res.json({
    message: 'User logged in successfully',
    token,
    userId: user._id,
  });
};

// Get profile controller
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');  // Do not return the password field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Edit Profile controller
export const editProfile = async (req, res) => {
  const { name, email, mobileNumber } = req.body;

  try {
    // Find the user by ID (from the decoded token)
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobileNumber = mobileNumber || user.mobileNumber;

    // Save the updated user
    await user.save();

    res.status(200).json(user);  // Return the updated user details
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get all users
export const getAllUsers = async (req, res) => {
  try {
      const user = await User.find();
      
      if (user.length === 0) {
          return res.status(404).json({ message: 'No user found.' });
      }

      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};


// Delete user controller
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user and remove
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// Block user controller (set isVerified to false)
export const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user and block
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Block user (set isVerified to false)
        user.isVerified = false;
        await user.save();

        res.status(200).json({ message: 'User blocked successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};


export const unblockUser = async (req, res) => {
  try {
      const { userId } = req.params;

      // Find the user and block
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Block user (set isVerified to false)
      user.isVerified = true;
      await user.save();

      res.status(200).json({ message: 'User unblocked successfully.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};


export const deleteOwnAccount = async (req, res) => {
  try {
    const userId = req.user.userId; // From token
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    await User.findByIdAndDelete(userId);  // ✅ Actually delete the user

    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
