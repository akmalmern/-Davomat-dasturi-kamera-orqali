import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSmena, getSmenalar } from '../../features/smenalar/smenaThunk';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateSmena = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const { smenalar } = useSelector(state => state.smena);

	const smena = smenalar.find(s => s._id === id);

	const [formData, setFormData] = useState({
		nomi: '',
		startTime: '',
		endTime: '',
	});

	// Agar smena topilmagan bo‘lsa, ro‘yxatni yuklab olamiz
	useEffect(() => {
		if (!smena) {
			dispatch(getSmenalar());
		} else {
			setFormData({
				nomi: smena.nomi,
				startTime: smena.startTime,
				endTime: smena.endTime,
			});
		}
	}, [smena, dispatch]);

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = e => {
		e.preventDefault();
		dispatch(updateSmena({ id, formData })).then(res => {
			// Yangilashdan keyin smenalar ro‘yxatiga qaytamiz
			navigate('/admin');
		});
	};

	return (
		<div className='max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10'>
			<h2 className='text-xl font-semibold mb-4 text-center'>Smenani tahrirlash</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<input
					type='text'
					name='nomi'
					value={formData.nomi}
					onChange={handleChange}
					placeholder='Smena nomi'
					className='border p-2 w-full rounded'
					required
				/>

				<input
					type='time'
					name='startTime'
					value={formData.startTime}
					onChange={handleChange}
					className='border p-2 w-full rounded'
					required
				/>

				<input
					type='time'
					name='endTime'
					value={formData.endTime}
					onChange={handleChange}
					className='border p-2 w-full rounded'
					required
				/>

				<button type='submit' className='bg-green-600 text-white py-2 px-4 rounded w-full'>
					Yangilash
				</button>
			</form>
		</div>
	);
};

export default UpdateSmena;
