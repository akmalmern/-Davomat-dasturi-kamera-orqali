import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useDispatch, useSelector } from 'react-redux';
import { checkOutDavomat } from '../../features/davomat/davomatThunk';
import { resetDavomat } from '../../features/davomat/davomatSlice';

export default function Chiqish() {
	const webcamRef = useRef(null);
	const canvasRef = useRef(null);
	const dispatch = useDispatch();
	const { loading, error, success, message, data } = useSelector(state => state.davomat);

	const [modelsLoaded, setModelsLoaded] = useState(false);
	const [status, setStatus] = useState('Model yuklanmoqda...');
	const [cameraOn, setCameraOn] = useState(false);
	const [sent, setSent] = useState(false);

	const [lookRight, setLookRight] = useState(false);
	const [lookLeft, setLookLeft] = useState(false);
	const [lookCenter, setLookCenter] = useState(false);

	//  Modellarni yuklash
	useEffect(() => {
		const loadModels = async () => {
			try {
				const MODEL_URL = '/models';
				await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
				await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
				setModelsLoaded(true);
				setStatus('Model tayyor');
			} catch (err) {
				setStatus('Model yuklashda xato');
				console.error(err);
			}
		};
		loadModels();
	}, []);

	// Yuzni aniqlash
	useEffect(() => {
		if (!modelsLoaded || !cameraOn) return;

		let interval;
		interval = setInterval(async () => {
			const video = webcamRef.current?.video;
			const canvas = canvasRef.current;
			if (!video || video.readyState !== 4) return;

			const width = video.videoWidth;
			const height = video.videoHeight;
			canvas.width = width;
			canvas.height = height;

			const displaySize = { width, height };
			faceapi.matchDimensions(canvas, displaySize);

			const detection = await faceapi
				.detectSingleFace(
					video,
					new faceapi.TinyFaceDetectorOptions({
						inputSize: 224,
						scoreThreshold: 0.3,
					})
				)
				.withFaceLandmarks();

			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, width, height);

			if (detection) {
				const resized = faceapi.resizeResults(detection, displaySize);
				const landmarks = resized.landmarks;

				faceapi.draw.drawDetections(canvas, resized);
				faceapi.draw.drawFaceLandmarks(canvas, resized);

				const leftEye = landmarks.getLeftEye();
				const rightEye = landmarks.getRightEye();
				const nose = landmarks.getNose();

				const avgPoint = points => ({
					x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
					y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
				});

				const leftEyeCenter = avgPoint(leftEye);
				const rightEyeCenter = avgPoint(rightEye);
				const noseCenter = nose[Math.floor(nose.length / 2)];

				const eyeDistance = rightEyeCenter.x - leftEyeCenter.x;
				const noseOffset = (noseCenter.x - leftEyeCenter.x) / eyeDistance;

				if (!lookRight && noseOffset > 0.6) {
					setLookRight(true);
					setStatus(' Endi ong tomonga qarang ➡️');
				} else if (lookRight && !lookLeft && noseOffset < 0.4) {
					setLookLeft(true);
					setStatus(' Endi to‘g‘ri qarang ');
				} else if (
					lookRight &&
					lookLeft &&
					!lookCenter &&
					noseOffset >= 0.35 &&
					noseOffset <= 0.65
				) {
					setLookCenter(true);
					setStatus(' Tekshiruv tugadi, serverga yuborilmoqda...');
				}

				if (lookRight && lookLeft && lookCenter && !sent) {
					setSent(true);
					clearInterval(interval);
					sendToBackend();
				}
			} else {
				setStatus(' Yuz topilmadi');
			}
		}, 500);

		return () => clearInterval(interval);
	}, [modelsLoaded, cameraOn, lookRight, lookLeft, lookCenter, sent]);

	//  Serverga yuborish
	const sendToBackend = async () => {
		try {
			const imageSrc = webcamRef.current.getScreenshot();
			if (!imageSrc) return;
			const blob = await fetch(imageSrc).then(res => res.blob());
			const file = new File([blob], 'checkout.jpg', { type: 'image/jpeg' });
			dispatch(checkOutDavomat(file));
		} finally {
			setCameraOn(false);
			setSent(false);
			setLookRight(false);
			setLookLeft(false);
			setLookCenter(false);
		}
	};

	//  Natija yoki xatolik
	useEffect(() => {
		if (success && data) {
			setStatus(` ${message} |  ${data.xodim} |  ${data.lavozim}`);
		} else if (error) {
			setStatus(` ${error}`);
		}
	}, [success, error, message, data]);

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg'>
				<h1 className='text-2xl font-bold mb-4'> Ishdan chiqish</h1>

				{cameraOn && (
					<div className='relative w-[400px] h-[300px]'>
						<Webcam
							ref={webcamRef}
							audio={false}
							screenshotFormat='image/jpeg'
							className='absolute top-0 left-0 w-full h-full rounded-xl object-cover'
							videoConstraints={{
								width: 400,
								height: 300,
								facingMode: 'user',
							}}
						/>
						<canvas ref={canvasRef} className='absolute top-0 left-0 w-full h-full' />
					</div>
				)}

				<p className='mt-4 text-lg text-blue-600 font-semibold'>
					{loading ? '⏳ Tekshirilmoqda...' : status}
				</p>

				<button
					onClick={() => {
						dispatch(resetDavomat());
						setCameraOn(true);
						setSent(false);
						setLookRight(false);
						setLookLeft(false);
						setLookCenter(false);
						setStatus('⬅️ Avval chap tomonga qarang');
					}}
					className='mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition'
				>
					Chiqish
				</button>

				{/*  Natija */}
				{success && data && (
					<div className='mt-4 text-left bg-green-50 p-4 rounded-lg shadow'>
						<p>
							<b>Xodim:</b> {data.xodim}
						</p>
						<p>
							<b>Lavozim:</b> {data.lavozim}
						</p>
						<p>
							<b>Smena:</b> {data.smena}
						</p>
						<p>
							<b>Check-in:</b> {data.checkIn}
						</p>
						<p>
							<b>Check-out:</b> {data.checkOut}
						</p>
						<p>
							<b>Ish vaqti:</b> {data.ishlaganVaqt}
						</p>
					</div>
				)}

				{/* Xato */}
				{error && (
					<div className='mt-4 text-left bg-red-50 text-red-600 p-4 rounded-lg shadow'>
						<p>{error}</p>
					</div>
				)}
			</div>
		</div>
	);
}
