import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../features/auth/authThunk';
import { clearError, clearForgotPasswordSuccess } from '../features/auth/authSlice';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { loading, error, forgotPasswordSuccess } = useSelector(state => state.auth);

	// Email validatsiyasi
	const validateEmail = email => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Forma yuborish
	const handleSubmit = e => {
		e.preventDefault();

		// Email validatsiyasi
		if (!email.trim()) {
			setEmailError('Email manzilini kiriting');
			return;
		}

		if (!validateEmail(email)) {
			setEmailError("To'g'ri email manzilini kiriting");
			return;
		}

		setEmailError('');
		dispatch(forgotPassword(email));
	};

	// Muvaffaqiyatli yuborilganda
	useEffect(() => {
		if (forgotPasswordSuccess) {
			// 3 soniyadan keyin reset password sahifasiga o'tish
			const timer = setTimeout(() => {
				navigate('/reset-password', { state: { email } });
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [forgotPasswordSuccess, navigate, email]);

	// Component unmount bo'lganda holatlarni tozalash
	useEffect(() => {
		return () => {
			dispatch(clearError());
			dispatch(clearForgotPasswordSuccess());
		};
	}, [dispatch]);

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Parolni unutdingizmi?
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						Email manzilingizni kiriting, sizga parolni tiklash kodi yuboramiz
					</p>
				</div>

				{/* Muvaffaqiyat xabari */}
				{forgotPasswordSuccess && (
					<div className='rounded-md bg-green-50 p-4'>
						<div className='flex'>
							<div className='flex-shrink-0'>
								<svg className='h-5 w-5 text-green-400' viewBox='0 0 20 20' fill='currentColor'>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<div className='ml-3'>
								<p className='text-sm font-medium text-green-800'>
									Parolni tiklash kodi emailingizga yuborildi!
								</p>
								<p className='text-sm text-green-700 mt-1'>
									3 soniyadan keyin parolni tiklash sahifasiga o'tasiz...
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Xatolik xabari */}
				{error && (
					<div className='rounded-md bg-red-50 p-4'>
						<div className='flex'>
							<div className='flex-shrink-0'>
								<svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<div className='ml-3'>
								<p className='text-sm font-medium text-red-800'>{error}</p>
							</div>
						</div>
					</div>
				)}

				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div>
						<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
							Email manzili
						</label>
						<div className='mt-1'>
							<input
								id='email'
								name='email'
								type='email'
								autoComplete='email'
								required
								value={email}
								onChange={e => {
									setEmail(e.target.value);
									if (emailError) setEmailError('');
									if (error) dispatch(clearError());
								}}
								className={`appearance-none relative block w-full px-3 py-2 border ${
									emailError ? 'border-red-300' : 'border-gray-300'
								} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
								placeholder='email@example.com'
								disabled={loading || forgotPasswordSuccess}
							/>
							{emailError && <p className='mt-1 text-sm text-red-600'>{emailError}</p>}
						</div>
					</div>

					<div>
						<button
							type='submit'
							disabled={loading || forgotPasswordSuccess}
							className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
								loading || forgotPasswordSuccess
									? 'bg-gray-400 cursor-not-allowed'
									: 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
							}`}
						>
							{loading ? (
								<>
									<svg
										className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
									>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
										></circle>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										></path>
									</svg>
									Yuborilmoqda...
								</>
							) : forgotPasswordSuccess ? (
								'Yuborildi ✓'
							) : (
								'Parolni tiklash kodini yuborish'
							)}
						</button>
					</div>

					<div className='text-center'>
						<Link to='/login' className='font-medium text-indigo-600 hover:text-indigo-500'>
							← Kirish sahifasiga qaytish
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
