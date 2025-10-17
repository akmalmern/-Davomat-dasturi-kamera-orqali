import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import xodimlarReducer from '../features/xodimlar/xodimlarSlice';
import smenaReducer from '../features/smenalar/smenaSlice';
import davomatReducer from '../features/davomat/davomatSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		xodimlar: xodimlarReducer,
		smena: smenaReducer,
		davomat: davomatReducer,
	},
});

export default store;
