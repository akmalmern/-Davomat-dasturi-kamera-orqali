import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profile } from './features/auth/authThunk';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UpdateSmena from './pages/smena/UpdateSmena';
import AddSmena from './pages/smena/AddSmena';
import Smenalar from './pages/smena/Smenalar';
import Xodimlar from './pages/Xodimlar/Xodimlar';
import XodimQoshish from './pages/Xodimlar/XodimQoshish';
import UpdateXodim from './pages/Xodimlar/UpdateXodim';
import Chiqish from './pages/davomat/Chiqish';
import XodimTarixi from './pages/davomat/XodimDavomatTarixi';
import KunlikHisobot from './pages/davomat/KinlikHosobot';
import HozirdaIshda from './pages/davomat/HozirdaIshda';
import SidebarLayout from './components/SidebarLayout';
import Home from './pages/Home';
import Kelish from './pages/davomat/Kelish';

function App() {
	const dispatch = useDispatch();
	const { isLogged, user, loading } = useSelector(state => state.auth);
	const [initialCheckDone, setInitialCheckDone] = useState(false);

	useEffect(() => {
		if (!initialCheckDone && !user && !isLogged) {
			dispatch(profile()).finally(() => {
				setInitialCheckDone(true);
			});
		}
	}, [dispatch, user, isLogged, initialCheckDone]);

	if (!initialCheckDone && loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Yuklanmoqda...</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<ToastContainer
				position='top-right'
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/kelish' element={<Kelish />} />
				<Route path='/ketish' element={<Chiqish />} />

				<Route path='/login' element={<Login />} />
				<Route path='/forgot-password' element={<ForgotPassword />} />
				<Route path='/reset-password' element={<ResetPassword />} />
				<Route element={<SidebarLayout />}>
					{/* Protected routes for authenticated users */}
					<Route element={<ProtectedRoute />}>
						<Route path='/profile' element={<ProfilePage />} />
					</Route>

					{/* Admin only routes */}
					<Route element={<AdminRoute />}>
						<Route path='/admin' element={<ProfilePage />} />
						<Route path='/update-smena/:id' element={<UpdateSmena />} />
						<Route path='/add-smena' element={<AddSmena />} />
						<Route path='/smena' element={<Smenalar />} />
						<Route path='/xodimlar' element={<Xodimlar />} />
						<Route path='/add-xodim' element={<XodimQoshish />} />
						<Route path='/update-xodim/:id' element={<UpdateXodim />} />
						<Route path='/davomat-tarixi/:id' element={<XodimTarixi />} />
						<Route path='/kunlik-hisobot' element={<KunlikHisobot />} />
						<Route path='/xozirda-ishda' element={<HozirdaIshda />} />
					</Route>
				</Route>

				<Route path='*' element={<Home />} />
			</Routes>
		</>
	);
}

export default App;
