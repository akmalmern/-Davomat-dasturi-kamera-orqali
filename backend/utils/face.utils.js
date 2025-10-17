const faceapi = require('face-api.js');
const path = require('path');
const canvas = require('canvas');
const sharp = require('sharp'); // Rasm hajmini optimallashtirish uchun
const ErrorResponse = require('./errorResponse'); // 👈 custom error
const { Canvas, Image, ImageData, loadImage } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_URL = path.join(__dirname, '../models');

// Modellarni yuklash
async function loadModels() {
	try {
		await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL); // Engilroq model
		await faceapi.nets.faceLandmark68TinyNet.loadFromDisk(MODEL_URL); // Kichikroq landmark modeli
		await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
	} catch (err) {
		throw new ErrorResponse('Face-api modellari yuklanmadi', 500);
	}
}

// Rasmni kichraytirish va deskriptorni olish
async function getFaceDescriptor(imagePath) {
	try {
		// Rasmni kichraytirish (masalan, 300x300 px)
		const resizedImage = await sharp(imagePath)
			.resize({ width: 300, height: 300, fit: 'inside' })
			.toBuffer();

		const img = await loadImage(resizedImage);
		const detection = await faceapi
			.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 })) // Engilroq detektor
			.withFaceLandmarks(true)
			.withFaceDescriptor();

		if (!detection) {
			throw new ErrorResponse('Yuz topilmadi, boshqa rasm yuboring', 400);
		}

		return detection.descriptor;
	} catch (err) {
		if (err instanceof ErrorResponse) throw err;
		throw new ErrorResponse('Yuzni qayta ishlashda xatolik', 500);
	}
}

// Float32Array → Buffer
function toBuffer(descriptor) {
	if (!descriptor) {
		throw new ErrorResponse('Descriptor mavjud emas', 400);
	}
	return Buffer.from(new Float32Array(descriptor).buffer);
}

// Buffer → Float32Array
function fromBuffer(buffer) {
	if (!buffer) {
		throw new ErrorResponse('Descriptor buffer bo‘sh', 400);
	}
	return new Float32Array(
		buffer.buffer,
		buffer.byteOffset,
		buffer.length / Float32Array.BYTES_PER_ELEMENT
	);
}

// Evklid masofasi
function euclideanDistance(arr1, arr2) {
	if (arr1.length !== arr2.length) {
		throw new ErrorResponse('Descriptor uzunligi mos emas', 400);
	}
	let sum = 0;
	for (let i = 0; i < arr1.length; i++) {
		const diff = arr1[i] - arr2[i];
		sum += diff * diff;
	}
	return Math.sqrt(sum);
}

// Eng yaqin xodimni topish (optimallashtirilgan)
async function findBestEmployee(newDescriptor, employees, threshold = 0.6) {
	if (!employees || employees.length === 0) {
		throw new ErrorResponse('Bazadan xodim topilmadi', 404);
	}

	let bestMatch = null;
	let minDistance = Infinity;

	// Parallel ravishda masofani hisoblash
	const distancePromises = employees.map(async emp => {
		const empDescriptor = fromBuffer(emp.faceDescriptor);
		return { emp, distance: euclideanDistance(newDescriptor, empDescriptor) };
	});

	const distances = await Promise.all(distancePromises);

	for (const { emp, distance } of distances) {
		if (distance < minDistance) {
			minDistance = distance;
			bestMatch = emp;
		}
	}

	if (minDistance > threshold) {
		throw new ErrorResponse('Xodim yuzidan topilmadi', 401);
	}

	return bestMatch;
}

module.exports = {
	loadModels,
	getFaceDescriptor,
	toBuffer,
	fromBuffer,
	findBestEmployee,
};
