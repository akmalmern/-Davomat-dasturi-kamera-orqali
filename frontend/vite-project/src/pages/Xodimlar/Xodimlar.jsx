import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteXodim, xodimlar } from '../../features/xodimlar/xodimlarThunk';
import { useNavigate } from 'react-router-dom';

const Xodimlar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { xodimlar: xodimList, loading } = useSelector(state => state.xodimlar);

	useEffect(() => {
		dispatch(xodimlar());
	}, [dispatch]);

	const handleDelete = id => {
		if (window.confirm("Xodimni o'chirishni tasdiqlaysizmi?")) {
			dispatch(deleteXodim(id));
		}
	};

	//  Davomat tarixiga o'tish
	const handleDavomatTarixi = id => {
		navigate(`/davomat-tarixi/${id}`);
	};

	return (
		<div className='max-w-6xl mx-auto mt-10 bg-white p-6 rounded shadow'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-xl font-bold'>Xodimlar ro‘yxati</h2>
				<button
					onClick={() => navigate('/add-xodim')}
					className='bg-green-600 text-white px-4 py-2 rounded'
				>
					Xodim qo‘shish
				</button>
			</div>

			{loading ? (
				<p>Yuklanmoqda...</p>
			) : xodimList.length === 0 ? (
				<p>Hozircha xodimlar yo‘q</p>
			) : (
				<table className='w-full border'>
					<thead>
						<tr className='bg-gray-100 text-left'>
							<th className='p-2 border'>#</th>
							<th className='p-2 border'>Rasm</th>
							<th className='p-2 border'>Ism Familiya</th>
							<th className='p-2 border'>Lavozim</th>
							<th className='p-2 border'>Telefon</th>
							<th className='p-2 border text-center'>Amallar</th>
						</tr>
					</thead>
					<tbody>
						{xodimList.map((item, index) => (
							<tr key={item._id} className='hover:bg-gray-50'>
								<td className='border p-2'>{index + 1}</td>
								<td className='border p-2'>
									<img
										src={`http://localhost:5000/${item.image}`}
										alt={item.fullName}
										className='w-14 h-14 object-cover rounded-full border'
									/>
								</td>
								<td className='border p-2'>{item.fullName}</td>
								<td className='border p-2'>{item.lavozim}</td>
								<td className='border p-2'>{item.telefon}</td>
								<td className='border p-2 flex flex-wrap gap-2 justify-center'>
									<button
										onClick={() => navigate(`/update-xodim/${item._id}`)}
										className='bg-blue-500 text-white px-3 py-1 rounded'
									>
										Tahrirlash
									</button>
									<button
										onClick={() => handleDelete(item._id)}
										className='bg-red-600 text-white px-3 py-1 rounded'
									>
										O‘chirish
									</button>
									<button
										onClick={() => handleDavomatTarixi(item._id)}
										className='bg-yellow-500 text-white px-3 py-1 rounded'
									>
										Davomat tarixi
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default Xodimlar;
