const mongoose = require('mongoose');

// Davomat modeli
const davomatSchema = new mongoose.Schema(
	{
		xodim: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Xodimlar', // bu Employee modeliga bog‘lanadi
			required: true,
		},
		smena: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Smena', // qaysi smenada ishlagan
			required: true,
		},
		checkIn: {
			type: Date,
			required: true, // ishga kelgan vaqt
		},
		checkOut: {
			type: Date, // ishni tugatgan vaqt (chiqqan vaqti)
		},
		status: {
			type: String,
			enum: ['Ishda', 'Ishga kech kelgan', 'Kelmagan', 'Ishdan chiqdi'],
			default: 'Ishda',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Davomat', davomatSchema);
