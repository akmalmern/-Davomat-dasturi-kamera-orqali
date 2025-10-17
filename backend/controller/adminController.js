const Xodimlar = require('../model/xodimlarModel');
const { getFaceDescriptor, toBuffer } = require('../utils/face.utils');
const ErrorResponse = require('../utils/errorResponse');
const Smena = require('../model/smenaModel');
const fs = require('fs');
const path = require('path');
const xodimQoshish = async (req, res, next) => {
	try {
		const { fullName, telefon, lavozim, smenaId } = req.body;
		// Smena mavjudligini tekshiramiz
		const smena = await Smena.findById(smenaId);
		if (!smena) {
			return res.status(404).json({ error: '❌ Smena topilmadi' });
		}
		// 🔹 Majburiy maydonlarni tekshirish
		if (!fullName || !telefon || !lavozim || !smenaId) {
			return next(new ErrorResponse('Barcha maydonlarni to‘ldiring', 400));
		}

		// 🔹 Rasm va yuz descriptor olish
		let faceDescriptor = null;
		if (req.file) {
			const descriptor = await getFaceDescriptor(req.file.path);
			if (!descriptor) {
				return next(new ErrorResponse('Yuz topilmadi, boshqa rasm yuklang', 400));
			}
			faceDescriptor = toBuffer(descriptor); // Buffer sifatida saqlash
		} else {
			return next(new ErrorResponse('Xodim rasmi majburiy', 400));
		}

		// 🔹 Yangi xodim yaratish
		const newEmployee = await Xodimlar.create({
			fullName,
			telefon,
			lavozim,
			image: req.file.path,
			faceDescriptor,
			smena: smena._id, // ✅ qaysi smenaga bog‘landi
		});

		res.status(201).json({
			success: true,
			message: 'Xodim qo‘shildi ✅',
			xodim: newEmployee,
		});
	} catch (error) {
		next(new ErrorResponse(error.message, 500));
	}
};

const xodimlar = async (req, res, next) => {
	try {
		const xodimlar = await Xodimlar.find({}).select('-faceDescriptor').populate('smena');
		if (!xodimlar) {
			return new ErrorResponse("Xodimlar xali qo'shilmagan", 401);
		}
		res.status(200).json({
			success: true,
			message: "Xodimlar ro'yxati",
			xodimlar,
		});
	} catch (error) {
		next(new ErrorResponse(error.message, 500));
	}
};

const deleteXodim = async (req, res, next) => {
	try {
		const { id } = req.params;
		const delX = await Xodimlar.findByIdAndDelete(id);
		if (!delX) {
			return next(new ErrorResponse('Xodim topilmadi', 404));
		}
		res.status(200).json({
			success: true,
			message: "Xodim o'chirildi",
		});
	} catch (error) {
		next(new ErrorResponse(error.message, 500));
	}
};

const updateXodim = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { fullName, telefon, lavozim, smenaId } = req.body;

		const xodim = await Xodimlar.findById(id);
		if (!xodim) return next(new ErrorResponse('Xodim topilmadi', 404));

		let updateData = {
			fullName: fullName || xodim.fullName,
			telefon: telefon || xodim.telefon,
			lavozim: lavozim || xodim.lavozim,
			smena: xodim.smena,
		};

		//  Smena yangilash
		if (smenaId) {
			const smena = await Smena.findById(smenaId);
			if (!smena) return next(new ErrorResponse('Smena topilmadi', 404));
			updateData.smena = smena._id;
		}

		//  Yangi rasm yuklangan bo‘lsa
		if (req.file) {
			// avval yuzni tekshiramiz
			const descriptor = await getFaceDescriptor(req.file.buffer);
			if (!descriptor) {
				return next(new ErrorResponse('Yuz topilmadi, boshqa rasm yuklang', 400));
			}

			// eski rasmni o‘chirish
			if (xodim.image && fs.existsSync(xodim.image)) {
				fs.unlinkSync(xodim.image);
			}

			//  Yuz topilgandan keyingina faylni diskka yozamiz
			const uploadDir = path.join(__dirname, '../uploads');
			if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

			const fileName = `xodim-${Date.now()}.jpg`;
			const filePath = path.join(uploadDir, fileName);

			fs.writeFileSync(filePath, req.file.buffer);

			// updateData.image = filePath;
			updateData.image = `uploads/${fileName}`;

			updateData.faceDescriptor = toBuffer(descriptor);
		}

		const updatedXodim = await Xodimlar.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			message: 'Xodim ma’lumotlari yangilandi',
			xodim: updatedXodim,
		});
	} catch (error) {
		next(new ErrorResponse(error.message, 500));
	}
};
module.exports = { xodimQoshish, xodimlar, deleteXodim, updateXodim };
