const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB);

		console.log('db ga ulandi');
	} catch (error) {
		console.log(error);
	}
};

module.exports = connectDB;
