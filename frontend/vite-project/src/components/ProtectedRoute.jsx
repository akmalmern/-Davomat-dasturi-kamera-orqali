import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
	const { loading, isLogged, user } = useSelector(state => state.auth);

	// Show loading spinner while checking authentication
	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Yuklanmoqda...</p>
				</div>
			</div>
		);
	}

	// Check if user is logged in
	return isLogged && user ? <Outlet /> : <Navigate to='/' replace />;
};

export default ProtectedRoute;
