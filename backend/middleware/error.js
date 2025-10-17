const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
	let error = err;

	// Mongoose xatolar
	if (err.name === 'CastError') {
		error = new ErrorResponse(`Resource not found with id: ${err.value}`, 404);
	}

	if (err.code === 11000) {
		const duplicateField = Object.keys(err.keyValue).join(', ');
		let errorMessage = '';

		switch (duplicateField) {
			case 'email':
				errorMessage = 'Bu email allaqachon ishlatilgan';
				break;
			case 'name':
				errorMessage = 'Bu kategoriya allaqachon mavjud';
				break;
			default:
				errorMessage = `Field(s) "${duplicateField}" uchun takroriy qiymat kiritildi`;
		}

		error = new ErrorResponse(errorMessage, 400);
	}

	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors)
			.map(val => val.message)
			.join(', ');
		error = new ErrorResponse(message, 400);
	}

	// Asosiy tuzatish shu yerda
	if (error instanceof ErrorResponse) {
		return res.status(error.statusCode).json({
			success: false,
			error: error.message,
		});
	}

	console.error('Unhandled error:', err);

	res.status(500).json({
		success: false,
		error: 'Internal Server Error',
	});
};
module.exports = errorHandler;
