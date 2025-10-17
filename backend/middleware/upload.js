const multer = require('multer');
const path = require('path');

// Rasm fayllarini uploads/ papkaga saqlaymiz
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

// Faqat rasm turlari
const fileFilter = (req, file, cb) => {
	const ok = ['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'].includes(file.mimetype);
	cb(ok ? null : new Error('Faqat JPEG/PNG rasm yuklang'), ok);
};

const upload = multer({ storage, fileFilter });

//  Memory storage (check-in qilishda)
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

module.exports = { upload, uploadMemory };
