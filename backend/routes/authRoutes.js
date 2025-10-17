const express = require('express');
const Admin = require('../model/adminModel.js');
const {
	login,
	adminProfile,
	logOut,
	refreshAccessToken,
	forgotPassword,
	resetPassword,
} = require('../controller/authController.js');
const { isAuthenticated, isAdmin } = require('../middleware/auth.js');

const router = express.Router();

router.post('/register', async (req, res) => {
	try {
		const { fullName, email, password, isAdmin } = req.body;

		// Email bandligini tekshirish
		const existingAdmin = await Admin.findOne({ email });
		if (existingAdmin) {
			return res.status(400).json({ error: 'Bunday email allaqachon mavjud' });
		}

		// Yangi admin yaratish
		const newAdmin = new Admin({
			fullName,
			email,
			password,
			isAdmin: isAdmin || false, // default false
		});

		await newAdmin.save();

		res.status(201).json({
			message: 'Admin muvaffaqiyatli ro‘yxatdan o‘tdi',
			admin: {
				id: newAdmin._id,
				fullName: newAdmin.fullName,
				email: newAdmin.email,
				isAdmin: newAdmin.isAdmin,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post('/login', login);
router.get('/profile', isAuthenticated, isAdmin, adminProfile);
router.get('/logout', logOut);
router.post('/refresh-access-token', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
