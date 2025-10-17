const Admin = require('../model/adminModel');
const ErrorResponse = require('../utils/errorResponse');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const login = async (req, res, next) => {
	try {
		const { password, email } = req.body;
		if (!password || !email) {
			return next(new ErrorResponse("Maydonni to'liq to'ldiring", 400));
		}
		const user = await Admin.findOne({ email });
		if (!user) {
			return next(new ErrorResponse('Admin topilmadi', 404));
		}

		const isMatch = await user.parolniTekshirish(password);
		if (!isMatch) {
			return next(new ErrorResponse("paro'l nato'g'ri", 400));
		}

		const accessToken = user.jwtAccessToken();
		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			// secure: process.env.NODE_ENV === "production",
			secure: true,
			sameSite: 'strict',
			maxAge: 24 * 60 * 60 * 1000,
		});
		const refreshToken = user.jwtRefreshToken();
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			// secure: process.env.NODE_ENV === "production",
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			success: true,
			message: 'Tzimga kirdingiz',
			accessToken,

			user,
		});
	} catch (error) {
		next(error);
	}
};
const adminProfile = async (req, res, next) => {
	try {
		res.status(200).json({
			success: true,
			user: req.user,
		});
	} catch (error) {
		next(error);
	}
};

const logOut = (req, res, next) => {
	try {
		res.clearCookie('refreshToken', {
			httpOnly: true,
			sameSite: 'Strict',
		});
		res.clearCookie('accessToken', {
			httpOnly: true,
			// secure: process.env.NODE_ENV === "production",
			secure: false,
			sameSite: 'Strict',
		});

		res.status(200).json({
			success: true,
			message: 'Tizimdan muvaffaqiyatli chiqdingiz',
		});
	} catch (error) {
		next(error);
	}
};

const refreshAccessToken = async (req, res, next) => {
	try {
		// Cookie’dan refreshToken ni olish
		const { refreshToken } = req.cookies;
		if (!refreshToken) {
			return next(new ErrorResponse('Refresh token topilmadi', 401));
		}

		// Refresh tokenni tekshirish
		let decoded;
		try {
			decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
		} catch (error) {
			return next(new ErrorResponse('Refresh token noto‘g‘ri yoki muddati tugagan', 401));
		}

		// Foydalanuvchini topish
		const user = await Admin.findById(decoded.id);
		if (!user) {
			return next(new ErrorResponse('foydalanuvchi topilmadi', 404));
		}

		// Yangi accessToken va refreshToken yaratish
		const newAccessToken = user.jwtAccessToken();

		// Cookie’ga yangi tokenlarni joylashtirish
		res.cookie('accessToken', newAccessToken, {
			httpOnly: true,

			secure: true,
			sameSite: 'strict',
			maxAge: 24 * 60 * 60 * 1000, // 1 soat
		});

		// Muvaffaqiyatli javob qaytarish
		res.status(200).json({
			success: true,
			accessToken: newAccessToken,
		});
	} catch (error) {
		console.error('Refresh token endpoint xatosi:', error);
		return res.status(500).json({
			success: false,
			message: 'Server xatosi: ' + error.message,
		});
	}
};

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER, // .env faylda saqlang
		pass: process.env.EMAIL_PASS, // Gmail uchun App Password
	},
});

const forgotPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		if (!email) return next(new ErrorResponse('Email kiritish majburiy', 400));

		const user = await Admin.findOne({ email });
		if (!user) return next(new ErrorResponse('Bu email bilan foydalanuvchi topilmadi', 404));

		// 6 raqamli tasodifiy kod generatsiyasi
		const resetToken = crypto.randomInt(100000, 1000000).toString();
		const resetTokenExpire = Date.now() + 3 * 60 * 1000;

		await Admin.updateOne(
			{ _id: user._id },
			{
				resetPasswordToken: resetToken,
				resetPasswordExpire: resetTokenExpire,
			}
		);

		const message = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: 'Parolni tiklash kodi',
			html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h4>Parolni tiklash</h4>
        <p>Sizning parolni tiklash kodingiz: <strong>${resetToken}</strong></p>
        <p>Kod 3 daqiqa amal qiladi.</p>
       
      </div>
    `,
		};
		await transporter.sendMail(message);

		res.status(200).json({
			success: true,
			message: 'Tasdiqlash kodi emailingizga yuborildi',
		});
	} catch (error) {
		console.error('Email yuborishda xato:', error.stack);
		return next(new ErrorResponse('Email yuborishda xatolik yuz berdi', 500));
	}
};

const resetPassword = async (req, res, next) => {
	try {
		const { resetToken, newPassword } = req.body;

		// Majburiy maydonlarni tekshirish
		if (!resetToken || !newPassword) {
			return next(new ErrorResponse(' kod va yangi parol kiritish majburiy', 400));
		}

		// Foydalanuvchini topish va tokenni tekshirish
		const user = await Admin.findOne({
			resetPasswordToken: resetToken,
			resetPasswordExpire: { $gt: Date.now() }, // Kod hali amalda
		});

		if (!user) {
			return next(new ErrorResponse('Noto‘g‘ri kod yoki kodning muddati tugagan', 400));
		}

		user.password = newPassword;
		user.resetPasswordToken = null; // Kodni o‘chirish
		user.resetPasswordExpire = null; // Muddatni o‘chirish
		await user.save();

		res.status(200).json({
			success: true,
			message: 'Parol muvaffaqiyatli yangilandi',
		});
	} catch (error) {
		console.error('Parolni tiklashda xato:', error.stack);
		return next(new ErrorResponse('Parolni tiklashda xatolik yuz berdi', 500));
	}
};

module.exports = { login, adminProfile, logOut, refreshAccessToken, resetPassword, forgotPassword };
