// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getXodimDavomatTarixi } from '../../features/davomat/davomatThunk';
// import { useParams } from 'react-router-dom';

// export default function XodimTarixi() {
// 	const { id: xodimId } = useParams();
// 	const dispatch = useDispatch();
// 	const { davomat, statistika, xodim, davr, loading, error } = useSelector(state => state.davomat);

// 	const [boshlanish, setBoshlanish] = useState('');
// 	const [tugash, setTugash] = useState('');

// 	// ⏳ Dastlabki yuklash
// 	useEffect(() => {
// 		if (xodimId) {
// 			dispatch(getXodimDavomatTarixi({ id: xodimId }));
// 		}
// 	}, [dispatch, xodimId]);

// 	// 📅 Filtrlash tugmasi
// 	const handleFilter = () => {
// 		dispatch(getXodimDavomatTarixi({ id: xodimId, boshlanish, tugash }));
// 	};

// 	// 🧹 Tozalash tugmasi
// 	const handleClear = () => {
// 		setBoshlanish('');
// 		setTugash('');
// 		dispatch(getXodimDavomatTarixi({ id: xodimId }));
// 	};

// 	if (loading) return <p>⏳ Yuklanmoqda...</p>;
// 	if (error) return <p style={{ color: 'red' }}>❌ {error}</p>;

// 	return (
// 		<div className='p-4 max-w-4xl mx-auto'>
// 			<h2 className='text-2xl font-bold mb-2'>📊 Xodim davomat tarixi</h2>
// 			{xodim && (
// 				<p className='mb-4'>
// 					👤 <b>{xodim.fullName}</b> — {xodim.lavozim}
// 				</p>
// 			)}

// 			{/* 📅 Sana bo‘yicha filter */}
// 			<div className='flex gap-2 mb-4'>
// 				<input
// 					type='date'
// 					value={boshlanish}
// 					onChange={e => setBoshlanish(e.target.value)}
// 					className='border p-2 rounded'
// 				/>
// 				<input
// 					type='date'
// 					value={tugash}
// 					onChange={e => setTugash(e.target.value)}
// 					className='border p-2 rounded'
// 				/>
// 				<button
// 					onClick={handleFilter}
// 					className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
// 				>
// 					Filter
// 				</button>
// 				<button
// 					onClick={handleClear}
// 					className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
// 				>
// 					🧹 Tozalash
// 				</button>
// 			</div>

// 			{/* 📈 Statistika */}
// 			{statistika && (
// 				<div className='border rounded p-3 mb-4 bg-gray-50'>
// 					<h3 className='font-semibold mb-2'>
// 						📌 Statistika ({davr?.boshlanish} – {davr?.tugash})
// 					</h3>
// 					<ul className='grid grid-cols-2 gap-2'>
// 						<li>
// 							Umumiy kunlar: <b>{statistika.umumiyKunlar}</b>
// 						</li>
// 						<li>
// 							Ishga kelgan kunlar: <b>{statistika.ishgaKelganKunlar}</b>
// 						</li>
// 						<li>
// 							Kech kelgan kunlar: <b>{statistika.kechKelganKunlar}</b>
// 						</li>
// 						<li>
// 							Kelmagan kunlar: <b>{statistika.kelmaganKunlar}</b>
// 						</li>
// 						<li>
// 							Umumiy kechikish: <b>{statistika.umumiyKechikish} daqiqa</b>
// 						</li>
// 						<li>
// 							Umumiy ishlagan vaqt:{' '}
// 							<b>
// 								{Math.floor(statistika.umumiyIshlaganVaqt / 60)} soat{' '}
// 								{statistika.umumiyIshlaganVaqt % 60} daqiqa
// 							</b>
// 						</li>
// 					</ul>
// 				</div>
// 			)}

// 			{/* 📅 Davomat jadvali */}
// 			<table className='w-full border-collapse border'>
// 				<thead>
// 					<tr className='bg-gray-200'>
// 						<th className='border p-2'>Sana</th>
// 						<th className='border p-2'>Smena</th>
// 						<th className='border p-2'>Kirish</th>
// 						<th className='border p-2'>Chiqish</th>
// 						<th className='border p-2'>Kechikish (daq)</th>
// 						<th className='border p-2'>Ishlagan vaqt</th>
// 						<th className='border p-2'>Status</th>
// 					</tr>
// 				</thead>
// 				<tbody>
// 					{davomat && davomat.length > 0 ? (
// 						davomat.map((item, idx) => (
// 							<tr key={idx} className='text-center'>
// 								<td className='border p-2'>{item.sana}</td>
// 								<td className='border p-2'>{item.smena}</td>
// 								<td className='border p-2'>{item.checkIn || '-'}</td>
// 								<td className='border p-2'>{item.checkOut || '-'}</td>
// 								<td className='border p-2'>{item.kechikish}</td>
// 								<td className='border p-2'>
// 									{Math.floor(item.ishlaganVaqt / 60)} soat {item.ishlaganVaqt % 60} daq
// 								</td>
// 								<td className='border p-2'>{item.status}</td>
// 							</tr>
// 						))
// 					) : (
// 						<tr>
// 							<td colSpan='7' className='p-3 text-center'>
// 								❌ Ma’lumot topilmadi
// 							</td>
// 						</tr>
// 					)}
// 				</tbody>
// 			</table>
// 		</div>
// 	);
// }
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getXodimDavomatTarixi } from '../../features/davomat/davomatThunk';
import { useParams } from 'react-router-dom';

export default function XodimTarixi() {
	const { id: xodimId } = useParams();
	const dispatch = useDispatch();
	const { davomat, statistika, xodim, davr, loading, error } = useSelector(state => state.davomat);

	const [boshlanish, setBoshlanish] = useState('');
	const [tugash, setTugash] = useState('');

	// Dastlabki yuklash
	useEffect(() => {
		if (xodimId) {
			dispatch(getXodimDavomatTarixi({ id: xodimId }));
		}
	}, [dispatch, xodimId]);

	// Filtrlash tugmasi
	const handleFilter = () => {
		dispatch(getXodimDavomatTarixi({ id: xodimId, boshlanish, tugash }));
	};

	// 🧹 Tozalash tugmasi
	const handleClear = () => {
		setBoshlanish('');
		setTugash('');
		dispatch(getXodimDavomatTarixi({ id: xodimId }));
	};

	//  Statusga qarab rang berish funksiyasi
	const getStatusClass = status => {
		switch (status) {
			case 'Kelmagan':
				return 'bg-red-500 text-white px-2 py-1 rounded font-semibold';
			case 'Ishga kech kelgan':
				return 'bg-yellow-400 text-black px-2 py-1 rounded font-semibold';
			case 'Ishda':
				return 'bg-green-500 text-white px-2 py-1 rounded font-semibold';
			default:
				return 'bg-gray-300 text-black px-2 py-1 rounded';
		}
	};

	if (loading) return <p> Yuklanmoqda...</p>;
	if (error) return <p style={{ color: 'red' }}> {error}</p>;

	return (
		<div className='p-4 max-w-4xl mx-auto'>
			<h2 className='text-2xl font-bold mb-2'>📊 Xodim davomat tarixi</h2>
			{xodim && (
				<p className='mb-4'>
					👤 <b>{xodim.fullName}</b> — {xodim.lavozim}
				</p>
			)}

			{/*  Sana bo‘yicha filter */}
			<div className='flex gap-2 mb-4'>
				<input
					type='date'
					value={boshlanish}
					onChange={e => setBoshlanish(e.target.value)}
					className='border p-2 rounded'
				/>
				<input
					type='date'
					value={tugash}
					onChange={e => setTugash(e.target.value)}
					className='border p-2 rounded'
				/>
				<button
					onClick={handleFilter}
					className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
				>
					Filter
				</button>
				<button
					onClick={handleClear}
					className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
				>
					Tozalash
				</button>
			</div>

			{/* Statistika */}
			{statistika && (
				<div className='border rounded p-3 mb-4 bg-gray-50'>
					<h3 className='font-semibold mb-2'>
						Statistika ({davr?.boshlanish} – {davr?.tugash})
					</h3>
					<ul className='grid grid-cols-2 gap-2'>
						<li>
							Umumiy kunlar: <b>{statistika.umumiyKunlar}</b>
						</li>
						<li>
							Ishga kelgan kunlar: <b>{statistika.ishgaKelganKunlar}</b>
						</li>
						<li>
							Kech kelgan kunlar: <b>{statistika.kechKelganKunlar}</b>
						</li>
						<li>
							Kelmagan kunlar: <b>{statistika.kelmaganKunlar}</b>
						</li>
						<li>
							Umumiy kechikish: <b>{statistika.umumiyKechikish} daqiqa</b>
						</li>
						<li>
							Umumiy ishlagan vaqt:{' '}
							<b>
								{Math.floor(statistika.umumiyIshlaganVaqt / 60)} soat{' '}
								{statistika.umumiyIshlaganVaqt % 60} daqiqa
							</b>
						</li>
					</ul>
				</div>
			)}

			{/* Davomat jadvali */}
			<table className='w-full border-collapse border'>
				<thead>
					<tr className='bg-gray-200'>
						<th className='border p-2'>Sana</th>
						<th className='border p-2'>Smena</th>
						<th className='border p-2'>Kirish</th>
						<th className='border p-2'>Chiqish</th>
						<th className='border p-2'>Kechikish (daq)</th>
						<th className='border p-2'>Ishlagan vaqt</th>
						<th className='border p-2'>Status</th>
					</tr>
				</thead>
				<tbody>
					{davomat && davomat.length > 0 ? (
						davomat.map((item, idx) => (
							<tr key={idx} className='text-center'>
								<td className='border p-2'>{item.sana}</td>
								<td className='border p-2'>{item.smena}</td>
								<td className='border p-2'>{item.checkIn || '-'}</td>
								<td className='border p-2'>{item.checkOut || '-'}</td>
								<td className='border p-2'>{item.kechikish}</td>
								<td className='border p-2'>
									{Math.floor(item.ishlaganVaqt / 60)} soat {item.ishlaganVaqt % 60} daq
								</td>
								<td className='border p-2'>
									<span className={getStatusClass(item.status)}>{item.status}</span>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan='7' className='p-3 text-center'>
								Ma’lumot topilmadi
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
