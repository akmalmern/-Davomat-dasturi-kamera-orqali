import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { login } from './../features/auth/authThunk';

const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const dispatch = useDispatch();
	const { user } = useSelector(state => state.auth);

	useEffect(() => {
		if (user) {
			if (user.isAdmin) {
				navigate('/admin'); // Admin uchun yo‘nalish
			} else {
				navigate('/login'); // Oddiy foydalanuvchi uchun yo‘nalish
			}
		}
	}, [user, navigate]);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			toast.error("Maydonlarni to'liq to'ldiring");
			return;
		}
		const data = {
			email: formData.email,
			password: formData.password,
		};
		dispatch(login(data));
	};

	return (
		<>
			<div className='flex items-center justify-center min-h-screen bg-gray-50'>
				<div className='mt-5 w-full px-4'>
					<h1 className='text-center text-2xl font-bold'>Tizimga kirish</h1>
					<form className='max-w-md mx-auto mt-8' onSubmit={handleSubmit}>
						<div className='relative z-0 w-full mb-6 group'>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								// disabled={isLoading}
								id='email'
								className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
								placeholder=' '
								required
							/>
							<label
								htmlFor='email'
								className='peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
							>
								Email manzil
							</label>
						</div>
						<div className='relative z-0 w-full mb-6 group'>
							<input
								type='password'
								name='password'
								value={formData.password}
								// disabled={isLoading}
								onChange={handleChange}
								id='password'
								className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
								placeholder=' '
								required
							/>
							<label
								htmlFor='password'
								className='peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
							>
								Parol
							</label>
							<Link to='/forgot-password'>
								<span className='text-red-500 hover:text-red-700 text-xs'>
									Parolni unutdingizmi?
								</span>
							</Link>
						</div>
						<button
							type='submit'
							// disabled={isLoading}
							className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center'
						>
							{'Tizimga kirish'}
						</button>
						<div className='mt-4 text-center'>
							<Link to='/register'>
								<span className='text-blue-500 hover:text-blue-700 text-sm'>Ro'yxatdan o'tish</span>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Login;
