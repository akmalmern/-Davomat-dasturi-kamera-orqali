import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSmenalar, deleteSmena } from '../../features/smenalar/smenaThunk';
import { Link, useNavigate } from 'react-router-dom';

const Smenalar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { smenalar, loading } = useSelector(state => state.smena);

	useEffect(() => {
		dispatch(getSmenalar());
	}, [dispatch]);

	const handleDelete = id => {
		if (window.confirm('Haqiqatan ham o‘chirmoqchimisiz?')) {
			dispatch(deleteSmena(id));
		}
	};

	const handleEdit = id => {
		navigate(`/update-smena/${id}`);
	};

	const handleAddSmena = () => {
		navigate('/add-smena');
	};

	return (
		<div className='max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg'>
			{/* Sarlavha va tugma */}
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-bold text-gray-800'>Smenalar ro‘yxati</h2>
				<button
					onClick={handleAddSmena}
					className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition active:scale-95 shadow'
				>
					+ Smena qo‘shish
				</button>
				<Link
					to='/admin'
					className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition active:scale-95 shadow'
				>
					Ortga Qaytish
				</Link>
			</div>

			{/* Jadval */}
			{loading ? (
				<p className='text-center text-gray-600'>Yuklanmoqda...</p>
			) : !Array.isArray(smenalar) || smenalar.length === 0 ? (
				<p className='text-center text-gray-600'>Hozircha smena yo‘q</p>
			) : (
				<div className='overflow-x-auto'>
					<table className='w-full border border-gray-200 rounded-lg overflow-hidden'>
						<thead>
							<tr className='bg-gray-100 text-left'>
								<th className='p-2 border'>#</th>
								<th className='p-2 border'>Nomi</th>
								<th className='p-2 border'>Boshlanish</th>
								<th className='p-2 border'>Tugash</th>
								<th className='p-2 border text-center'>Amal</th>
							</tr>
						</thead>
						<tbody>
							{smenalar.map((item, index) => (
								<tr key={item._id} className='hover:bg-gray-50 transition-colors'>
									<td className='border p-2'>{index + 1}</td>
									<td className='border p-2 font-medium'>{item.nomi}</td>
									<td className='border p-2'>{item.startTime}</td>
									<td className='border p-2'>{item.endTime}</td>
									<td className='border p-2 text-center space-x-2'>
										<button
											onClick={() => handleEdit(item._id)}
											className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition active:scale-95'
										>
											Tahrirlash
										</button>
										<button
											onClick={() => handleDelete(item._id)}
											className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition active:scale-95'
										>
											O‘chirish
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default Smenalar;
