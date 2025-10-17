import React from 'react';
import FaceCheckin from './davomat/Kelish';
import Chiqish from './davomat/Chiqish';
import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 p-6'>
			<div className='flex flex-col sm:flex-row gap-10'>
				<Link
					to='/kelish'
					className='w-48 h-48 sm:w-56 sm:h-56 bg-green-600 text-white rounded-full flex items-center justify-center text-center font-semibold text-xl sm:text-2xl shadow-xl hover:bg-green-700 hover:scale-105 transition-all duration-300'
				>
					Kirish
				</Link>
				<Link
					to='/ketish'
					className='w-48 h-48 sm:w-56 sm:h-56 bg-red-600 text-white rounded-full flex items-center justify-center text-center font-semibold text-xl sm:text-2xl shadow-xl hover:bg-red-700 hover:scale-105 transition-all duration-300'
				>
					Chiqish
				</Link>
			</div>
		</div>
	);
};

export default Home;
