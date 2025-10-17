const jwt = require('jsonwebtoken');

// JWT token generatsiya qilish funksiyasi
const generateToken = userId => {
	return jwt.sign(
		{ id: userId }, // payload
		process.env.JWT_SECRET, // maxfiy kalit
		{ expiresIn: '7d' } // token muddati
	);
};

module.exports = generateToken;
