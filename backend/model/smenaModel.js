const mongoose = require('mongoose');

const smenaSchema = new mongoose.Schema(
	{
		nomi: { type: String, required: true }, // Masalan: "1-smena"
		startTime: { type: String, required: true }, // "08:00"
		endTime: { type: String, required: true }, // "17:00"
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Smena', smenaSchema);
