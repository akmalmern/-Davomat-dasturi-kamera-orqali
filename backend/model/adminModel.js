const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: [true, 'F.I.SHni kiritishingiz shart'],
		},
		email: {
			type: String,
			unique: true,
			required: [true, 'Emailingizni kiritishingiz shart'],
			match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'bu email emas tekshirib koring'],
		},
		password: {
			type: String,
			required: [true, "Paro'lingizni kiritishingiz kerak!"],
			// match: [
			// 	/^(?=.*\d)(?=.*[@#\-_$%^&+=§!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!\?]+$/,
			// 	'Parolda kamida 1 ta katta harf, 1 ta kichik harf, 1 ta raqam va maxsus belgi boʻlishi kerak.',
			// ],
		},

		isAdmin: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: {
			type: String,
			sparse: true, // Faqat mavjud bo‘lganda indekslanadi
			default: null,
		},
		resetPasswordExpire: {
			type: Date,
			default: null,
			expires: 180, // 3 daqiqadan keyin avtomatik o‘chadi
		},
	},
	{ timestamps: true, versionKey: false }
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next(); // Parol o'zgarmagan bo‘lsa, davom etish
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		console.error('Parolni hash qilishda xatolik:', error);

		next(error);
	}
});

// login bilan kirganda parolni tekshirish
userSchema.methods.parolniTekshirish = async function (bazadagiparol) {
	try {
		return await bcrypt.compare(bazadagiparol, this.password);
	} catch (error) {
		console.log('Parolni tekshirishda xato:', error);
	}
};
userSchema.methods.jwtAccessToken = function () {
	const secret = process.env.JWT_ACCESS_TOKEN;
	if (!secret) {
		return ErrorResponse('JWT_ACCESS_TOKEN muhit o‘zgaruvchisi topilmadi!');
	}
	return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_ACCESS_TOKEN, {
		expiresIn: '1d',
	});
};

userSchema.methods.jwtRefreshToken = function () {
	const secret = process.env.JWT_REFRESH_TOKEN;
	if (!secret) {
		return ErrorResponse('JWT_REFRESH_TOKEN muhit o‘zgaruvchisi topilmadi!');
	}
	return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_REFRESH_TOKEN, {
		expiresIn: '7d',
	});
};

module.exports = mongoose.model('Admin', userSchema);
