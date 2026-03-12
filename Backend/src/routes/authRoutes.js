const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile, forgotPassword, verifyOTP, resetPassword } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', upload.single('profilePhoto'), updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
module.exports = router;