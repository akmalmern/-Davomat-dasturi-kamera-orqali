import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKunlikHisobot } from '../../features/davomat/davomatThunk';

export default function KunlikHisobot() {
	const dispatch = useDispatch();
	const { kunlikHisobot, loading, error } = useSelector(state => state.davomat);
	const [sana, setSana] = useState('');

	useEffect(() => {
		dispatch(getKunlikHisobot(sana));
	}, [dispatch, sana]);

	if (loading) return <p> Yuklanmoqda...</p>;
	if (error) return <p style={{ color: 'red' }}> {error}</p>;

	return (
		<div className='p-4 max-w-4xl mx-auto'>
			<h2 className='text-2xl font-bold mb-4'>📅 Kunlik hisobot</h2>

			<input
				type='date'
				value={sana}
				onChange={e => setSana(e.target.value)}
				className='border p-2 rounded mb-4'
			/>

			{kunlikHisobot && (
				<>
					<div className='mb-4'>
						<p>
							<b>Sana:</b> {kunlikHisobot.sana}
						</p>
						<p>
							<b>Umumiy xodimlar:</b> {kunlikHisobot.umumiyXodimlar}
						</p>
						<p>
							<b>Ishga kelganlar:</b> {kunlikHisobot.ishgaKelganlar}
						</p>
						<p>
							<b>Kech kelganlar:</b> {kunlikHisobot.kechKelganlar}
						</p>
						<p>
							<b>Kelmaganlar:</b> {kunlikHisobot.kelmaganlar}
						</p>
					</div>

					<table className='w-full border-collapse border'>
						<thead>
							<tr className='bg-gray-200'>
								<th className='border p-2'>Xodim</th>
								<th className='border p-2'>Lavozim</th>
								<th className='border p-2'>Smena</th>
								<th className='border p-2'>Kirish</th>
								<th className='border p-2'>Chiqish</th>
								<th className='border p-2'>Status</th>
							</tr>
						</thead>
						<tbody>
							{kunlikHisobot.detaylar.map((item, idx) => (
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
									<td className='border p-2'>{item.smena}</td>
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
