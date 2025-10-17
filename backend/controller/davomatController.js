const Xodimlar = require('../model/xodimlarModel');
const Davomat = require('../model/davomatModel');
const Smena = require('../model/smenaModel');
const { getFaceDescriptor, findBestEmployee } = require('../utils/face.utils');
const moment = require('moment');
const ErrorResponse = require('../utils/errorResponse');

// Davomat qo'shish (Check-in)
const addDavomat = async (req, res, next) => {
	try {
		if (!req.file) return next(new ErrorResponse('Rasm yuborilmadi', 400));

		// Yangi descriptor
		const newDescriptor = await getFaceDescriptor(req.file.buffer);

		// Barcha xodimlar
		const employees = await Xodimlar.find({ faceDescriptor: { $exists: true } }).populate('smena');

		if (!employees.length) {
			return next(new ErrorResponse('Bazadan xodim topilmadi', 404));
		}

		// Eng yaqin xodimni topish
		const matchedEmployee = await findBestEmployee(newDescriptor, employees);
		if (!matchedEmployee) {
			return next(new ErrorResponse('Xodim yuzidan topilmadi', 401));
		}

		// Xodimning smenasini olish
		const smena = matchedEmployee.smena;
		if (!smena) {
			return next(new ErrorResponse('Xodim smenaga biriktrilmagan', 400));
		}

		// Hozirgi vaqt
		const now = moment();
		const todayStart = now.clone().startOf('day');
		const todayEnd = now.clone().endOf('day');

		// Bugun allaqachon check-in qilganmi tekshirish
		const existingAttendance = await Davomat.findOne({
			xodim: matchedEmployee._id,
			checkIn: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() },
		});

		if (existingAttendance && !existingAttendance.checkOut) {
			return next(new ErrorResponse('Xodim bugun allaqachon ishga kelgan', 400));
		}

		// Smena vaqti
		const start = moment(smena.startTime, 'HH:mm');
		const end = moment(smena.endTime, 'HH:mm');

		// Status aniqlash (model schemaga mos)
		let status = 'Ishda';
		let kechikish = 0;

		if (now.isAfter(start)) {
			kechikish = now.diff(start, 'minutes');
			if (kechikish > 5) {
				status = 'Ishga kech kelgan';
			}
		}

		if (now.isAfter(end)) {
			status = 'Kelmagan';
		}

		// Davomat yozish - faqat model schemadagi fieldlar
		const attendance = await Davomat.create({
			xodim: matchedEmployee._id,
			checkIn: now.toDate(),
			smena: smena._id,
			status,
		});

		res.json({
			success: true,
			message: " Xodim davomatdan o'tdi",
			xodim: matchedEmployee.fullName,
			lavozim: matchedEmployee.lavozim,
			smena: smena.nomi,
			time: now.format('YYYY-MM-DD HH:mm'),
			status,
			kechikish: kechikish > 0 ? `${kechikish} daqiqa` : "Yo'q",
			attendanceId: attendance._id,
		});
	} catch (err) {
		next(new ErrorResponse(err.message, 500));
	}
};

// Ishdan chiqish (Check-out)
const chiqish = async (req, res, next) => {
	try {
		if (!req.file) return res.status(400).json({ error: 'Rasm yuborilmadi' });

		const newDescriptor = await getFaceDescriptor(req.file.buffer);
		const employees = await Xodimlar.find({ faceDescriptor: { $exists: true } });

		if (!employees.length) return res.status(404).json({ error: 'Xodim topilmadi' });

		const matchedEmployee = await findBestEmployee(newDescriptor, employees);
		if (!matchedEmployee) return res.status(401).json({ error: 'Xodim yuzidan topilmadi' });

		const now = moment();

		// Bugungi sana bo'yicha oxirgi checkIn topamiz
		const todayStart = now.clone().startOf('day');
		const todayEnd = now.clone().endOf('day');

		const attendance = await Davomat.findOne({
			xodim: matchedEmployee._id,
			checkIn: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() },
			checkOut: { $exists: false },
		}).populate('smena');

		if (!attendance) {
			return res
				.status(404)
				.json({ error: 'Bugun check-in qilinmagan yoki allaqachon chiqib ketgan' });
		}

		// Ishlagan vaqtni hisoblash
		const workDuration = now.diff(moment(attendance.checkIn), 'minutes');
		const workHours = Math.floor(workDuration / 60);
		const workMinutes = workDuration % 60;

		// findByIdAndUpdate() bilan yangilash - faqat model schemadagi fieldlar
		const updatedAttendance = await Davomat.findByIdAndUpdate(
			attendance._id,
			{
				checkOut: now.toDate(),
				status: 'Ishdan chiqdi',
			},
			{ new: true, runValidators: true }
		).populate('smena');

		res.json({
			success: true,
			message: '✅ Xodim ishdan chiqdi',
			xodim: matchedEmployee.fullName,
			lavozim: matchedEmployee.lavozim,
			smena: updatedAttendance.smena.nomi,
			checkIn: moment(updatedAttendance.checkIn).format('HH:mm'),
			checkOut: moment(updatedAttendance.checkOut).format('HH:mm'),
			ishlaganVaqt: `${workHours} soat ${workMinutes} daqiqa`,
			status: updatedAttendance.status,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

//  Xodimning davomat tarixini olish (kelmagan kunlarni ham ko'rsatish bilan)
const xodimDavomatTarixi = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { boshlanish, tugash } = req.query;

		const startDate = boshlanish ? moment(boshlanish) : moment().subtract(30, 'days');
		const endDate = tugash ? moment(tugash) : moment();

		//  Xodim mavjudligini tekshirish
		const xodim = await Xodimlar.findById(id);
		if (!xodim) {
			return next(new ErrorResponse('Xodim topilmadi', 404));
		}

		//  Mavjud davomat yozuvlarini olish
		const attendances = await Davomat.find({
			xodim: id,
			checkIn: {
				$gte: startDate.clone().startOf('day').toDate(),
				$lte: endDate.clone().endOf('day').toDate(),
			},
		})
			.populate('smena')
			.sort({ checkIn: 1 });

		// Sana oralig‘idagi barcha ish kunlarini shakllantiramiz
		let davomatList = [];
		let currentDate = startDate.clone();

		while (currentDate.isSameOrBefore(endDate, 'day')) {
			const dayOfWeek = currentDate.isoWeekday(); // 1 = Dushanba ... 7 = Yakshanba

			// faqat dushanbadan shanbagacha ko'ramiz
			if (dayOfWeek >= 1 && dayOfWeek <= 6) {
				// O‘sha kunga attendance bor yoki yo‘qligini tekshiramiz
				const attendance = attendances.find(a => moment(a.checkIn).isSame(currentDate, 'day'));

				if (attendance) {
					const smenaStart = moment(attendance.smena?.startTime, 'HH:mm');
					const checkInTime = moment(attendance.checkIn);
					const kechikish = checkInTime.isAfter(smenaStart)
						? checkInTime.diff(smenaStart, 'minutes')
						: 0;

					const ishlaganVaqt = attendance.checkOut
						? moment(attendance.checkOut).diff(moment(attendance.checkIn), 'minutes')
						: 0;

					davomatList.push({
						sana: currentDate.format('YYYY-MM-DD'),
						checkIn: attendance.checkIn ? moment(attendance.checkIn).format('HH:mm') : null,
						checkOut: attendance.checkOut ? moment(attendance.checkOut).format('HH:mm') : null,
						smena: attendance.smena ? attendance.smena.nomi : 'Noma’lum',
						status: attendance.status,
						kechikish,
						ishlaganVaqt,
					});
				} else {
					//  Agar o‘sha kuni attendance yo‘q bo‘lsa — "Kelmagan"
					davomatList.push({
						sana: currentDate.format('YYYY-MM-DD'),
						checkIn: null,
						checkOut: null,
						smena: 'Ish kuni',
						status: 'Kelmagan',
						kechikish: 0,
						ishlaganVaqt: 0,
					});
				}
			}

			currentDate.add(1, 'day');
		}

		// Statistika hisoblash
		const statistika = {
			umumiyKunlar: davomatList.length,
			ishgaKelganKunlar: davomatList.filter(a => a.status !== 'Kelmagan').length,
			kechKelganKunlar: davomatList.filter(a => a.status === 'Ishga kech kelgan').length,
			kelmaganKunlar: davomatList.filter(a => a.status === 'Kelmagan').length,
		};

		res.json({
			success: true,
			xodim: {
				fullName: xodim.fullName,
				lavozim: xodim.lavozim,
			},
			davr: {
				boshlanish: startDate.format('YYYY-MM-DD'),
				tugash: endDate.format('YYYY-MM-DD'),
			},
			statistika,
			davomat: davomatList,
		});
	} catch (err) {
		next(new ErrorResponse(err.message, 500));
	}
};

// Kunlik davomat hisoboti
const kunlikHisobot = async (req, res, next) => {
	try {
		const { sana } = req.query;
		const targetDate = sana ? moment(sana) : moment();

		const dayStart = targetDate.clone().startOf('day');
		const dayEnd = targetDate.clone().endOf('day');

		const attendances = await Davomat.find({
			checkIn: { $gte: dayStart.toDate(), $lte: dayEnd.toDate() },
		}).populate('xodim smena');

		const hisobot = {
			sana: targetDate.format('YYYY-MM-DD'),
			umumiyXodimlar: attendances.length,
			ishgaKelganlar: attendances.filter(a => a.status !== 'Kelmagan').length,
			kechKelganlar: attendances.filter(a => a.status === 'Ishga kech kelgan').length,
			kelmaganlar: attendances.filter(a => a.status === 'Kelmagan').length,
			ishdan_chiqganlar: attendances.filter(a => a.checkOut).length,
			detaylar: attendances.map(attendance => {
				// Ishlagan vaqtni hisoblash
				const ishlaganVaqt = attendance.checkOut
					? moment(attendance.checkOut).diff(moment(attendance.checkIn), 'minutes')
					: 0;

				// Kechikishni hisoblash
				const smenaStart = moment(attendance.smena.startTime, 'HH:mm');
				const checkInTime = moment(attendance.checkIn);
				const kechikish = checkInTime.isAfter(smenaStart)
					? checkInTime.diff(smenaStart, 'minutes')
					: 0;

				return {
					xodim: attendance.xodim.fullName,
					lavozim: attendance.xodim.lavozim,
					smena: attendance.smena.nomi,
					checkIn: attendance.checkIn ? moment(attendance.checkIn).format('HH:mm') : null,
					checkOut: attendance.checkOut ? moment(attendance.checkOut).format('HH:mm') : null,
					status: attendance.status,
					kechikish: kechikish,
					ishlaganVaqt: ishlaganVaqt
						? `${Math.floor(ishlaganVaqt / 60)}:${ishlaganVaqt % 60}`
						: null,
				};
			}),
		};

		res.json({
			success: true,
			hisobot,
		});
	} catch (err) {
		next(new ErrorResponse(err.message, 500));
	}
};

// Smena bo'yicha hisobot
const smenaHisoboti = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { sana } = req.query;

		const targetDate = sana ? moment(sana) : moment();
		const dayStart = targetDate.clone().startOf('day');
		const dayEnd = targetDate.clone().endOf('day');

		const smena = await Smena.findById(id);
		if (!smena) {
			return next(new ErrorResponse('Smena topilmadi', 404));
		}

		const attendances = await Davomat.find({
			smena: id,
			checkIn: { $gte: dayStart.toDate(), $lte: dayEnd.toDate() },
		}).populate('xodim');

		const hisobot = {
			smena: smena.nomi,
			sana: targetDate.format('YYYY-MM-DD'),
			smenaVaqti: `${smena.startTime} - ${smena.endTime}`,
			xodimlarSoni: attendances.length,
			ishgaKelganlar: attendances.filter(a => a.status !== 'Kelmagan').length,
			kechKelganlar: attendances.filter(a => a.status === 'Ishga kech kelgan').length,
			kelmaganlar: attendances.filter(a => a.status === 'Kelmagan').length,
			detaylar: attendances.map(attendance => {
				// Kechikishni hisoblash
				const smenaStart = moment(smena.startTime, 'HH:mm');
				const checkInTime = moment(attendance.checkIn);
				const kechikish = checkInTime.isAfter(smenaStart)
					? checkInTime.diff(smenaStart, 'minutes')
					: 0;

				return {
					xodim: attendance.xodim.fullName,
					lavozim: attendance.xodim.lavozim,
					checkIn: attendance.checkIn ? moment(attendance.checkIn).format('HH:mm') : null,
					checkOut: attendance.checkOut ? moment(attendance.checkOut).format('HH:mm') : null,
					status: attendance.status,
					kechikish,
				};
			}),
		};

		res.json({
			success: true,
			hisobot,
		});
	} catch (err) {
		next(new ErrorResponse(err.message, 500));
	}
};

// Hozirda ishda bo'lgan xodimlar
const hozirdaIshda = async (req, res, next) => {
	try {
		const now = moment();
		const todayStart = now.clone().startOf('day');
		const todayEnd = now.clone().endOf('day');

		const activeAttendances = await Davomat.find({
			checkIn: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() },
			checkOut: { $exists: false },
			status: { $ne: 'Kelmagan' },
		}).populate('xodim smena');

		const ishgaKelganXodimlar = activeAttendances.map(attendance => ({
			xodim: attendance.xodim.fullName,
			lavozim: attendance.xodim.lavozim,
			smena: attendance.smena.nomi,
			kelganVaqt: moment(attendance.checkIn).format('HH:mm'),
			ishlaganVaqt: now.diff(moment(attendance.checkIn), 'minutes'),
			status: attendance.status,
		}));

		res.json({
			success: true,
			sana: now.format('YYYY-MM-DD'),
			vaqt: now.format('HH:mm'),
			hozirdaIshda: ishgaKelganXodimlar.length,
			xodimlar: ishgaKelganXodimlar,
		});
	} catch (err) {
		next(new ErrorResponse(err.message, 500));
	}
};

// Davomat o'chirish (admin uchun)
const davomatOchirish = async (req, res, next) => {
	try {
		const { attendanceId } = req.params;

		const attendance = await Davomat.findById(attendanceId).populate('xodim');
		if (!attendance) {
			return next(new ErrorResponse('Davomat yozuvi topilmadi', 404));
		}

		// findByIdAndDelete() bilan o'chirish
		await Davomat.findByIdAndDelete(attendanceId);

		res.json({
			success: true,
			message: "Davomat yozuvi o'chirildi",
			ochirilganDavomat: {
				xodim: attendance.xodim.fullName,
				sana: moment(attendance.checkIn).format('YYYY-MM-DD'),
				vaqt: moment(attendance.checkIn).format('HH:mm'),
			},
		});
	} catch (err) {
		next(new ErrorResponse(err.message, 500));
	}
};

// Davomat tahrirlash (admin uchun)
const davomatTahrirlash = async (req, res, next) => {
	try {
		const { attendanceId } = req.params;
		const { checkIn, checkOut, status } = req.body;

		const attendance = await Davomat.findById(attendanceId).populate('xodim smena');
		if (!attendance) {
			return next(new ErrorResponse('Davomat yozuvi topilmadi', 404));
		}

		// Yangilanish uchun obyekt tayyorlash - faqat model schemadagi fieldlar
		const updateData = {};

		if (checkIn) {
			updateData.checkIn = moment(checkIn).toDate();
		}

		if (checkOut) {
			updateData.checkOut = moment(checkOut).toDate();
		}

		if (status) {
			updateData.status = status;
		}

		// findByIdAndUpdate() bilan yangilash
		const updatedAttendance = await Davomat.findByIdAndUpdate(attendanceId, updateData, {
			new: true,
			runValidators: true,
		}).populate('xodim smena');

		// Ishlagan vaqtni hisoblash (response uchun)
		const ishlaganVaqt = updatedAttendance.checkOut
			? moment(updatedAttendance.checkOut).diff(moment(updatedAttendance.checkIn), 'minutes')
			: 0;

		res.json({
			success: true,
			message: 'Davomat yozuvi tahrirlandi',
			davomat: {
				xodim: updatedAttendance.xodim.fullName,
				sana: moment(updatedAttendance.checkIn).format('YYYY-MM-DD'),
				checkIn: moment(updatedAttendance.checkIn).format('HH:mm'),
				checkOut: updatedAttendance.checkOut
					? moment(updatedAttendance.checkOut).format('HH:mm')
					: null,
				status: updatedAttendance.status,
				ishlaganVaqt,
			},
		});
	} catch (err) {
		next(new ErrorResponse(err.message, 500));
	}
};

module.exports = {
	addDavomat,
	chiqish,
	kunlikHisobot,
	xodimDavomatTarixi,
	smenaHisoboti,
	hozirdaIshda,
	davomatOchirish,
	davomatTahrirlash,
};
