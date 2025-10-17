import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../features/auth/authThunk';

const ResetPassword = () => {
	const [resetToken, setResetToken] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { resetPasswordSuccess } = useSelector(state => state.auth);

	const handleSubmit = e => {
		e.preventDefault();
		dispatch(resetPassword({ resetToken, newPassword }));
	};

	useEffect(() => {
		if (resetPasswordSuccess) {
			navigate('/login');
		}
	}, [resetPasswordSuccess, navigate]);

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4'>
			<div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-xl'>
				<h1 className='text-center text-3xl font-extrabold text-gray-800 mb-6'>
					Yangi paro‘l yaratish
				</h1>

				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Tasdiqlash kodi */}
					<div className='relative'>
						<input
							type='number'
							name='resetToken'
							value={resetToken}
							onChange={e => setResetToken(e.target.value)}
							id='resetToken'
							className='peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all'
							placeholder='Tasdiqlash kodi'
							required
						/>
						<label
							htmlFor='resetToken'
							className='absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-600'
						>
							Tasdiqlash paro‘li
						</label>
					</div>

					{/* Yangi parol */}
					<div className='relative'>
						<input
							type={showPassword ? 'text' : 'password'}
							name='password'
							value={newPassword}
							onChange={e => setNewPassword(e.target.value)}
							id='password'
							className='peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all'
							placeholder='Yangi parol'
							required
						/>
						<label
							htmlFor='password'
							className='absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-600'
						>
							Yangi paro‘l
						</label>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600 text-xl select-none'
						>
							{showPassword ? '👁‍🗨' : '👁'}
						</button>
					</div>

					{/* Submit tugmasi */}
					<button
						type='submit'
						className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm tracking-wide hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95'
					>
						Parolni tiklash
					</button>

					{/* Login sahifasiga qaytish */}
					<div className='text-center text-sm'>
						<Link
							to='/login'
							className='text-blue-600 hover:text-blue-800 font-medium transition-colors'
						>
							Login sahifasiga qaytish
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
