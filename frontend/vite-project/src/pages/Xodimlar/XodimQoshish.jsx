import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { xodimQoshish } from '../../features/xodimlar/xodimlarThunk';
import { resetXodimlarState } from '../../features/xodimlar/xodimlarSlice';
import { getSmenalar } from '../../features/smenalar/smenaThunk'; //  smenalar thunk
import { useNavigate } from 'react-router-dom';

const XodimQoshish = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { loading, success } = useSelector(state => state.xodimlar);
	const { smenalar } = useSelector(state => state.smena); //  smenalar ro‘yxati

	const [formData, setFormData] = useState({
		fullName: '',
		telefon: '',
		lavozim: '',
		smenaId: '',
		image: null,
	});

	useEffect(() => {
		dispatch(getSmenalar()); //  smenalarni olish
	}, [dispatch]);

	useEffect(() => {
		if (success) {
			dispatch(resetXodimlarState());
			navigate('/xodimlar');
		}
	}, [success, dispatch, navigate]);

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFileChange = e => {
		setFormData({ ...formData, image: e.target.files[0] });
	};

	const handleSubmit = e => {
		e.preventDefault();

		const data = new FormData();
		data.append('fullName', formData.fullName);
		data.append('telefon', formData.telefon);
		data.append('lavozim', formData.lavozim);
		data.append('smenaId', formData.smenaId);
		if (formData.image) {
			data.append('image', formData.image);
		}

		dispatch(xodimQoshish(data));
	};

	return (
		<div className='max-w-md mx-auto mt-10 bg-white p-6 rounded shadow'>
			<h2 className='text-xl font-bold mb-4 text-center'>Xodim qo‘shish</h2>
			<form onSubmit={handleSubmit} className='space-y-4' encType='multipart/form-data'>
				<div>
					<label className='block mb-1'>Ism Familiya</label>
					<input
						type='text'
						name='fullName'
						value={formData.fullName}
						onChange={handleChange}
						required
						className='w-full border px-3 py-2 rounded'
					/>
				</div>
				<div>
					<label className='block mb-1'>Lavozim</label>
					<input
						type='text'
						name='lavozim'
						value={formData.lavozim}
						onChange={handleChange}
						required
						className='w-full border px-3 py-2 rounded'
					/>
				</div>
				<div>
					<label className='block mb-1'>Telefon</label>
					<input
						type='text'
						name='telefon'
						value={formData.telefon}
						onChange={handleChange}
						required
						className='w-full border px-3 py-2 rounded'
					/>
				</div>

				{/*  Smena tanlash */}
				<div>
					<label className='block mb-1'>Smena</label>
					<select
						name='smenaId'
						value={formData.smenaId}
						onChange={handleChange}
						required
						className='w-full border px-3 py-2 rounded'
					>
						<option value=''>— Smena tanlang —</option>
						{smenalar.map(smena => (
							<option key={smena._id} value={smena._id}>
								{smena.nomi} ({smena.startTime} - {smena.endTime})
							</option>
						))}
					</select>
				</div>

				{/*  Rasm yuklash */}
				<div>
					<label className='block mb-1'>Xodim rasmi</label>
					<input
						type='file'
						name='image'
						accept='image/*'
						onChange={handleFileChange}
						required
						className='w-full'
					/>
				</div>

				<button
					type='submit'
					disabled={loading}
					className='bg-blue-600 text-white w-full py-2 rounded mt-2'
				>
					{loading ? 'Yuborilmoqda...' : 'Qo‘shish'}
				</button>
			</form>
		</div>
	);
};

export default XodimQoshish;
