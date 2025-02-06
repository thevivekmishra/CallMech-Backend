import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js'

// Signup controller
export const signup = async (req, res) => {
  const { name, email, password, confirmPassword, mobileNumber } = req.body;

  // Validate passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user (No 'isMechanic' logic needed now)
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    mobileNumber,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);  // Compare password
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, isMechanic: user.isMechanic },
    process.env.JWT_SECRET_KEY,  // Use JWT_SECRET_KEY here
    { expiresIn: process.env.JWT_EXPIRES }  // Optionally, use the JWT_EXPIRES variable as well
  );

  res.json({ token });
};
