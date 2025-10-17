import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../features/auth/authThunk';
import { Home, LogOut, User, Settings, CalendarDays, Users, Clock, Menu } from 'lucide-react';
import { useState } from 'react';

export default function SidebarLayout() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector(state => state.auth);
	const [isOpen, setIsOpen] = useState(false); // 📱 Mobil menyu holati

	const handleLogout = async () => {
		await dispatch(logOut());
		navigate('/login');
	};

	return (
		<div className='min-h-screen flex bg-gray-100'>
			{/* Sidebar */}
			<aside
				className={`${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				} md:translate-x-0 fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 z-50`}
			>
				<div className='px-6 py-4 border-b flex justify-between items-center'>
					<h2 className='text-2xl font-bold text-blue-600'>Ish Tizimi</h2>
					<button className='md:hidden p-2 text-gray-600' onClick={() => setIsOpen(false)}>
						✖
					</button>
				</div>

				<nav className='flex-1 p-4 space-y-2'>
					<button
						onClick={() => navigate('/')}
						className='flex items-center w-full px-3 py-2 text-gray-700 rounded hover:bg-blue-50 hover:text-blue-600'
					>
						<Home className='w-5 h-5 mr-2' /> Bosh sahifa
					</button>
					<button
						onClick={() => navigate('/smena')}
						className='flex items-center w-full px-3 py-2 text-gray-700 rounded hover:bg-blue-50 hover:text-blue-600'
					>
						<CalendarDays className='w-5 h-5 mr-2' /> Smenalar
					</button>
					<button
						onClick={() => navigate('/xodimlar')}
						className='flex items-center w-full px-3 py-2 text-gray-700 rounded hover:bg-blue-50 hover:text-blue-600'
					>
						<Users className='w-5 h-5 mr-2' /> Xodimlar
					</button>
					<button
						onClick={() => navigate('/kunlik-hisobot')}
						className='flex items-center w-full px-3 py-2 text-gray-700 rounded hover:bg-blue-50 hover:text-blue-600'
					>
						<Clock className='w-5 h-5 mr-2' /> Kunlik hisobot
					</button>
					<button
						onClick={() => navigate('/xozirda-ishda')}
						className='flex items-center w-full px-3 py-2 text-gray-700 rounded hover:bg-blue-50 hover:text-blue-600'
					>
						<User className='w-5 h-5 mr-2' /> Xozirda ishda
					</button>
					{user?.isAdmin && (
						<button
							onClick={() => navigate('/admin')}
							className='flex items-center w-full px-3 py-2 text-red-600 rounded hover:bg-red-50'
						>
							<Settings className='w-5 h-5 mr-2' /> Admin panel
						</button>
					)}
				</nav>

				<div className='border-t p-4'>
					<button
						onClick={handleLogout}
						className='flex items-center w-full px-3 py-2 text-red-600 rounded hover:bg-red-50'
					>
						<LogOut className='w-5 h-5 mr-2' /> Tizimdan chiqish
					</button>
				</div>
			</aside>

			{/* Kontent */}
			<div className='flex-1 flex flex-col'>
				{/* Mobil menyu tugmasi */}
				<header className='bg-white shadow p-4 flex justify-between items-center md:hidden'>
					<button onClick={() => setIsOpen(true)} className='text-gray-600 hover:text-blue-600'>
						<Menu className='w-6 h-6' />
					</button>
					<h1 className='text-lg font-bold text-blue-600'>Ish Tizimi</h1>
				</header>

				<main className='flex-1 p-4 md:p-6'>
					{/* Sahifa ichidagi komponentlar shu yerda ko‘rinadi */}
					<Outlet />
				</main>
			</div>
		</div>
	);
}
