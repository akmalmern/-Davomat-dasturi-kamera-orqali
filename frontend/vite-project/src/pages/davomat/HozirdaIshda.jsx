import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHozirdaIshda } from '../../features/davomat/davomatThunk';

export default function HozirdaIshda() {
	const dispatch = useDispatch();
	const { hozirdaIshda, loading, error } = useSelector(state => state.davomat);

	useEffect(() => {
		dispatch(getHozirdaIshda());
		const interval = setInterval(() => {
			dispatch(getHozirdaIshda());
		}, 60000);
		return () => clearInterval(interval);
	}, [dispatch]);

	if (loading) return <p>⏳ Yuklanmoqda...</p>;
	if (error) return <p className='text-red-500'> {error}</p>;

	return (
		<div className='p-4 max-w-4xl mx-auto'>
			<h2 className='text-2xl font-bold mb-4'>👷 Hozirda ishda bo‘lgan xodimlar</h2>

			{hozirdaIshda && (
				<>
					<p>
						<b>Sana:</b> {hozirdaIshda.sana}
					</p>
					<p>
						<b>Vaqt:</b> {hozirdaIshda.vaqt}
					</p>
					<p>
						<b>Xodimlar soni:</b> {hozirdaIshda.hozirdaIshda}
					</p>

					<table className='w-full border-collapse border mt-3'>
						<thead>
							<tr className='bg-gray-200'>
								<th className='border p-2'>Xodim</th>
								<th className='border p-2'>Lavozim</th>
								<th className='border p-2'>Smena</th>
								<th className='border p-2'>Kelgan vaqt</th>
								<th className='border p-2'>Ishlagan vaqt (daq)</th>
								<th className='border p-2'>Status</th>
							</tr>
						</thead>
						<tbody>
							{hozirdaIshda.xodimlar.map((item, idx) => (
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
									<td className='border p-2'>{item.kelganVaqt}</td>
									<td className='border p-2'>{item.ishlaganVaqt}</td>
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
