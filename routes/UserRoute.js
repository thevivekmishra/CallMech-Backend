import express from 'express';
import { signup, login, getProfile, editProfile, verifyEmail, getAllUsers, deleteUser, blockUser, unblockUser } from '../controller/UserController.js';
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

//get all user
router.get('/all-users',getAllUsers);

// Delete user route
router.delete('/delete-user/:userId', deleteUser);

// Block user route
router.put('/block-user/:userId', blockUser);
 
router.put('/unblock-user/:userId', unblockUser);

export default router;
