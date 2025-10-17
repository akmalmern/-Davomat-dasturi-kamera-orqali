// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { updateXodim, xodimlar } from '../../features/xodimlar/xodimlarThunk';
// import { getSmenalar } from '../../features/smenalar/smenaThunk'; // 🔸 smenalar uchun

// const UpdateXodim = () => {
// 	const { id } = useParams();

// 	const dispatch = useDispatch();
// 	const navigate = useNavigate();

// 	const { xodimlar: list, loading } = useSelector(state => state.xodimlar);
// 	const { smenalar } = useSelector(state => state.smena);

// 	const xodim = list.find(x => x._id === id);
// 	console.log(xodim.smena);
// 	const [form, setForm] = useState({
// 		fullName: '',
// 		telefon: '',
// 		lavozim: '',
// 		smena: '',
// 		image: null,
// 	});

// 	// 🔹 Xodimlar va smenalarni yuklash
// 	useEffect(() => {
// 		dispatch(xodimlar());
// 		dispatch(getSmenalar());
// 	}, [dispatch]);

// 	// 🔹 Tanlangan xodimni formaga joylash
// 	useEffect(() => {
// 		if (xodim) {
// 			setForm({
// 				fullName: xodim.fullName || '',
// 				telefon: xodim.telefon || '',
// 				lavozim: xodim.lavozim || '',
// 				smena: xodim.smena?._id || '',
// 				image: null,
// 			});
// 		}
// 	}, [xodim]);

// 	const handleChange = e => {
// 		setForm({ ...form, [e.target.name]: e.target.value });
// 	};

// 	const handleFile = e => {
// 		setForm({ ...form, image: e.target.files[0] });
// 	};

// 	const handleSubmit = e => {
// 		e.preventDefault();
// 		const formData = new FormData();
// 		formData.append('fullName', form.fullName);
// 		formData.append('telefon', form.telefon);
// 		formData.append('lavozim', form.lavozim);
// 		formData.append('smena', form.smena);
// 		if (form.image) formData.append('image', form.image);

// 		dispatch(updateXodim({ id, formData })).then(res => {
// 			if (res.meta.requestStatus === 'fulfilled') {
// 				navigate('/xodimlar');
// 			}
// 		});
// 	};

// 	if (loading && !xodim) return <p>Yuklanmoqda...</p>;

// 	return (
// 		<div className='max-w-md mx-auto mt-10 bg-white p-6 rounded shadow'>
// 			<h2 className='text-xl font-bold mb-4'>Xodimni tahrirlash</h2>
// 			<form onSubmit={handleSubmit} className='space-y-4'>
// 				{/* Ism Familiya */}
// 				<input
// 					type='text'
// 					name='fullName'
// 					value={form.fullName}
// 					onChange={handleChange}
// 					className='border p-2 w-full rounded'
// 					placeholder='Ism Familiya'
// 					required
// 				/>

// 				{/* Telefon */}
// 				<input
// 					type='text'
// 					name='telefon'
// 					value={form.telefon}
// 					onChange={handleChange}
// 					className='border p-2 w-full rounded'
// 					placeholder='Telefon'
// 					required
// 				/>

// 				{/* Lavozim */}
// 				<input
// 					type='text'
// 					name='lavozim'
// 					value={form.lavozim}
// 					onChange={handleChange}
// 					className='border p-2 w-full rounded'
// 					placeholder='Lavozim'
// 					required
// 				/>

// 				{/* Smena tanlash */}
// 				<select
// 					name='smena'
// 					value={form.smena}
// 					onChange={handleChange}
// 					className='border p-2 w-full rounded'
// 					required
// 				>
// 					<option value=''>Smena tanlang</option>
// 					{smenalar?.map(s => (
// 						<option key={s._id} value={s._id}>
// 							{s.nomi}
// 						</option>
// 					))}
// 				</select>

// 				{/* Rasm yuklash */}
// 				<input
// 					type='file'
// 					name='image'
// 					onChange={handleFile}
// 					className='border p-2 w-full rounded'
// 				/>

// 				{/* Tugma */}
// 				<button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded w-full'>
// 					Yangilash
// 				</button>
// 			</form>
// 		</div>
// 	);
// };

// export default UpdateXodim;
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateXodim, xodimlar } from '../../features/xodimlar/xodimlarThunk';
import { getSmenalar } from '../../features/smenalar/smenaThunk';

const UpdateXodim = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { xodimlar: list, loading } = useSelector(state => state.xodimlar);
	const { smenalar } = useSelector(state => state.smena);

	const xodim = list.find(x => x._id === id);

	const [form, setForm] = useState({
		fullName: '',
		telefon: '',
		lavozim: '',
		smena: '',
		image: null,
	});

	//  Xodimlar va smenalarni yuklash
	useEffect(() => {
		dispatch(xodimlar());
		dispatch(getSmenalar());
	}, [dispatch]);

	//  Forma ma'lumotlarini to'ldirish
	useEffect(() => {
		if (xodim && smenalar.length > 0) {
			setForm({
				fullName: xodim.fullName || '',
				telefon: xodim.telefon || '',
				lavozim: xodim.lavozim || '',
				smena: xodim.smena?._id || '',
				image: null,
			});
		}
	}, [xodim, smenalar]);

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleFile = e => {
		setForm({ ...form, image: e.target.files[0] });
	};

	const handleSubmit = e => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('fullName', form.fullName);
		formData.append('telefon', form.telefon);
		formData.append('lavozim', form.lavozim);
		formData.append('smenaId', form.smena);
		if (form.image) formData.append('image', form.image);

		dispatch(updateXodim({ id, formData })).then(res => {
			if (res.meta.requestStatus === 'fulfilled') {
				navigate('/xodimlar');
			}
		});
	};

	if (loading && !xodim) return <p>Yuklanmoqda...</p>;

	return (
		<div className='max-w-md mx-auto mt-10 bg-white p-6 rounded shadow'>
			<h2 className='text-xl font-bold mb-4'>Xodimni tahrirlash</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				{/* Ism Familiya */}
				<input
					type='text'
					name='fullName'
					value={form.fullName}
					onChange={handleChange}
					className='border p-2 w-full rounded'
					placeholder='Ism Familiya'
					required
				/>

				{/* Telefon */}
				<input
					type='text'
					name='telefon'
					value={form.telefon}
					onChange={handleChange}
					className='border p-2 w-full rounded'
					placeholder='Telefon'
					required
				/>

				{/* Lavozim */}
				<input
					type='text'
					name='lavozim'
					value={form.lavozim}
					onChange={handleChange}
					className='border p-2 w-full rounded'
					placeholder='Lavozim'
					required
				/>

				{/* Smena tanlash */}
				<select
					name='smena'
					value={form.smena}
					onChange={handleChange}
					className='border p-2 w-full rounded'
					required
				>
					<option value=''>Smena tanlang</option>
					{smenalar?.map(s => (
						<option key={s._id} value={s._id}>
							{s.nomi}
						</option>
					))}
				</select>

				{/* Rasm yuklash */}
				<input
					type='file'
					name='image'
					onChange={handleFile}
					className='border p-2 w-full rounded'
				/>

				{/* Tugma */}
				<button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded w-full'>
					Yangilash
				</button>
			</form>
		</div>
	);
};

export default UpdateXodim;
