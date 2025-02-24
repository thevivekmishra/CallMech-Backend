// import express from 'express';
// import { signup, login, getProfile, editProfile } from '../controller/AuthController.js';
// import protect from '../middleware/AuthMiddleware.js';

// const router = express.Router();

// // Signup Route
// router.post('/signup', signup);

// // Login Route
// router.post('/login', login);

// // Profile Route (Protected)
// router.get('/profile', protect, getProfile);

// // Edit Profile Route (Protected)
// router.put('/profile', protect, editProfile);  

// export default router;



import express from 'express';
import { signup, login, getProfile, editProfile, verifyEmail } from '../controller/AuthController.js';
import protect from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Email Verification Route
router.get('/verify-email', verifyEmail); // Added route for email verification

// Login Route
router.post('/login', login);

// Profile Route (Protected)
router.get('/profile', protect, getProfile);

// Edit Profile Route (Protected)
router.put('/profile', protect, editProfile);

export default router;
