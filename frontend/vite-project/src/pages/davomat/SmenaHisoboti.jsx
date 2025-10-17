import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSmenaHisoboti } from '../../features/davomat/davomatThunk';

export default function SmenaHisoboti() {
	const dispatch = useDispatch();
	const { smenaHisoboti, loading, error } = useSelector(state => state.davomat);

	const [smenaId, setSmenaId] = useState('');
	const [sana, setSana] = useState('');

	const handleFilter = () => {
		if (smenaId) dispatch(getSmenaHisoboti({ id: smenaId, sana }));
	};

	return (
		<div className='p-4 max-w-4xl mx-auto'>
			<h2 className='text-2xl font-bold mb-4'> Smena hisoboti</h2>

			<div className='flex gap-2 mb-4'>
				<input
					type='text'
					placeholder='Smena ID'
					value={smenaId}
					onChange={e => setSmenaId(e.target.value)}
					className='border p-2 rounded'
				/>
				<input
					type='date'
					value={sana}
					onChange={e => setSana(e.target.value)}
					className='border p-2 rounded'
				/>
				<button onClick={handleFilter} className='bg-blue-600 text-white px-4 py-2 rounded'>
					Filter
				</button>
			</div>

			{loading && <p> Yuklanmoqda...</p>}
			{error && <p className='text-red-500'>❌ {error}</p>}

			{smenaHisoboti && (
				<>
					<p>
						<b>Smena:</b> {smenaHisoboti.smena}
					</p>
					<p>
						<b>Smena vaqti:</b> {smenaHisoboti.smenaVaqti}
					</p>
					<p>
						<b>Xodimlar soni:</b> {smenaHisoboti.xodimlarSoni}
					</p>
					<p>
						<b>Kelmaganlar:</b> {smenaHisoboti.kelmaganlar}
					</p>

					<table className='w-full border-collapse border mt-3'>
						<thead>
							<tr className='bg-gray-200'>
								<th className='border p-2'>Xodim</th>
								<th className='border p-2'>Lavozim</th>
								<th className='border p-2'>Kirish</th>
								<th className='border p-2'>Chiqish</th>
								<th className='border p-2'>Status</th>
							</tr>
						</thead>
						<tbody>
							{smenaHisoboti.detaylar.map((item, idx) => (
								<tr
									key={idx}
									className={`text-center ${
										item.status === 'Kelmagan'
											? 'bg-red-200'
											: item.status === 'Ishga kech kelgan'
											? 'bg-yellow-200'
											: 'bg-green-200'
									}`}
								>
									<td className='border p-2'>{item.xodim}</td>
									<td className='border p-2'>{item.lavozim}</td>
									<td className='border p-2'>{item.checkIn || '-'}</td>
									<td className='border p-2'>{item.checkOut || '-'}</td>
									<td className='border p-2'>{item.status}</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			)}
		</div>
	);
}
