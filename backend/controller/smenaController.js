const Smena = require('../model/smenaModel');
const ErrorResponse = require('../utils/errorResponse');

const addSmena = async (req, res) => {
	try {
		const { nomi, startTime, endTime } = req.body;

		if (!nomi || !startTime || !endTime) {
			return next(new ErrorResponse('Barcha maydonlar to‘ldirilishi shart', 400));
		}
		const smena = await Smena.create({ nomi, startTime, endTime });

		res.status(201).json({
			message: ' Smena muvaffaqiyatli qo‘shildi',
			smena,
		});
	} catch (err) {
		next(new ErrorResponse(err.message, 500));
	}
};

const smenalar = async (req, res, next) => {
	try {
		const smen = await Smena.find();
		res.json({
			success: true,
			message: 'Smenalar',
			smenalar_soni: smen.length,
			smen,
		});
	} catch (error) {
		next(error);
	}
};

const deleteSmena = async (req, res, next) => {
	try {
		const smena = await Smena.findByIdAndDelete(req.params.id);
		if (!smena) {
			return next(new ErrorResponse('Smena topilmadi', 404));
		}

		res.json({ success: true, message: 'Smena o‘chirildi' });
	} catch (err) {
		new ErrorResponse(err.message, 500);
	}
};

const updateSmena = async (req, res, next) => {
	try {
		const { nomi, startTime, endTime } = req.body;
		const smenId = req.params.id;
		const sme = await Smena.findById(smenId);
		if (!sme) {
			return next(new ErrorResponse('Smena topilmadi', 404));
		}

		const newData = {
			nomi: nomi.trim() || sme.nomi,
			startTime: startTime.trim() || sme.startTime,
			endTime: endTime.trim() || sme.endTime,
		};

		const upSmena = await Smena.findByIdAndUpdate(smenId, newData, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			success: true,
			message: 'Yangilandi',
			upSmena,
		});
	} catch (error) {
		next(new ErrorResponse(error.message, 500));
	}
};

module.exports = { addSmena, smenalar, deleteSmena, updateSmena };
