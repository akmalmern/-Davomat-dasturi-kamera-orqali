import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSmena } from '../../features/smenalar/smenaThunk';
import { resetSmenaState } from '../../features/smenalar/smenaSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddSmena = () => {
	const dispatch = useDispatch();
	const { loading, success, error } = useSelector(state => state.smena);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		nomi: '',
		startTime: '',
		endTime: '',
	});

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (!formData.nomi || !formData.startTime || !formData.endTime) {
			toast.warning('Barcha maydonlar to‘ldirilishi shart!');
			return;
		}
		dispatch(addSmena(formData));
	};

	useEffect(() => {
		if (success) {
			setFormData({ nomi: '', startTime: '', endTime: '' });
			dispatch(resetSmenaState());
			setTimeout(() => {
				navigate('/smena');
			}, 1000);
		}
		if (error) dispatch(resetSmenaState());
	}, [success, error, dispatch]);

	return (
		<div className='max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10'>
			<h2 className='text-xl font-semibold mb-4 text-center'>Smena qo‘shish</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<input
					type='text'
					name='nomi'
					value={formData.nomi}
					onChange={handleChange}
					placeholder='Smena nomi'
					className='border p-2 w-full rounded'
				/>

				<input
					type='time'
					name='startTime'
					value={formData.startTime}
					onChange={handleChange}
					className='border p-2 w-full rounded'
				/>

				<input
					type='time'
					name='endTime'
					value={formData.endTime}
					onChange={handleChange}
					className='border p-2 w-full rounded'
				/>

				<button
					type='submit'
					disabled={loading}
					className='bg-blue-600 text-white py-2 px-4 rounded w-full'
				>
					{loading ? 'Yuklanmoqda...' : 'Qo‘shish'}
				</button>
			</form>
		</div>
	);
};

export default AddSmena;
