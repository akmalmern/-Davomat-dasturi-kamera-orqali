import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../features/auth/authThunk';
import { Home, LogOut, User, Settings, CalendarDays, Users, Clock } from 'lucide-react';

export default function ProfilePage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, loading } = useSelector(state => state.auth);

	const handleLogout = async () => {
		try {
			await dispatch(logOut()).unwrap();
			navigate('/login');
		} catch (error) {
			console.log(error);
			navigate('/login');
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-100'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Yuklanmoqda...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-100'>
				<div className='text-center'>
					<p className='text-gray-600'>Foydalanuvchi ma'lumotlari topilmadi</p>
					<button
						onClick={() => navigate('/login')}
						className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
					>
						Login sahifasiga o'tish
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex bg-gray-100'>
			{/*  Sidebar menyu */}

			{/* Profil kontent qismi */}
			<main className='flex-1 p-6'>
				{/* Header */}
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-3xl font-bold text-gray-800'> Profil</h1>
					<div className='flex items-center gap-3'>
						{user.isAdmin && (
							<span className='bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded'>
								Admin
							</span>
						)}
						<button
							onClick={handleLogout}
							className='flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition'
						>
							<LogOut className='w-5 h-5 mr-1' /> Chiqish
						</button>
					</div>
				</div>

				{/* User info card */}
				<div className='bg-white rounded-lg shadow p-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label className='block text-sm font-medium text-gray-600 mb-1'>To‘liq ism</label>
							<p className='text-lg text-gray-900 bg-gray-50 p-3 rounded-md'>
								{user.fullName || 'Kiritilmagan'}
							</p>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-600 mb-1'>Email</label>
							<p className='text-lg text-gray-900 bg-gray-50 p-3 rounded-md'>{user.email}</p>
						</div>
						{user.phone && (
							<div>
								<label className='block text-sm font-medium text-gray-600 mb-1'>Telefon</label>
								<p className='text-lg text-gray-900 bg-gray-50 p-3 rounded-md'>{user.phone}</p>
							</div>
						)}
						{user.createdAt && (
							<div>
								<label className='block text-sm font-medium text-gray-600 mb-1'>
									Ro‘yxatdan o‘tgan sana
								</label>
								<p className='text-lg text-gray-900 bg-gray-50 p-3 rounded-md'>
									{new Date(user.createdAt).toLocaleDateString('uz-UZ')}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Footer / additional info */}
				<div className='mt-6 text-center text-gray-500 text-sm'>
					<p>© {new Date().getFullYear()} Ish Tizimi — barcha huquqlar himoyalangan</p>
				</div>
			</main>
		</div>
	);
}
