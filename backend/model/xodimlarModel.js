const mongoose = require('mongoose');

const xodimlarSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true }, // F.I.O
		telefon: { type: String, required: true }, // Telefon
		lavozim: { type: String, required: true }, // Lavozim
		image: { type: String }, // Yuz rasmi (path yoki URL)
		faceDescriptor: { type: Buffer }, // massiv emas, buffer
		smena: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Smena', // ✅ smenaModel bilan bog‘lanadi
			required: true,
		},
	},

	{ timestamps: true }
);

module.exports = mongoose.model('Xodimlar', xodimlarSchema);
