import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { toast } from 'react-toastify';

//  Login
export const login = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
	try {
		const res = await api.post('/auth/login', formData);
		toast.success(res.data.message);
		return res.data; // { user, accessToken }
	} catch (error) {
		toast.error(error.response?.data?.error || 'Login xatosi');
		return rejectWithValue(error.response?.data?.message);
	}
});

// Profil olish
export const profile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
	try {
		const { data } = await api.get('/auth/profile');
		return data.user;
	} catch (error) {
		// console.log('getProfile error:', error.response?.data?.message);
		return rejectWithValue(error.response?.data?.message);
	}
});

//  Logout
export const logOut = createAsyncThunk('auth/logOut', async (_, { rejectWithValue }) => {
	try {
		const { data } = await api.get('/auth/logout');
		toast.success(data.message);
		return null;
	} catch (error) {
		console.log(error);
		toast.error(error.response?.data?.message || 'Logout xatosi');
		return rejectWithValue(error.response?.data?.error);
	}
});

// PAROLNI UNUTISH (FORGOT PASSWORD)
export const forgotPassword = createAsyncThunk(
	'auth/forgot-password',
	async (email, { rejectWithValue }) => {
		try {
			const { data } = await api.post('/auth/forgot-password', { email });
			toast.success(data.message || 'Parolni tiklash kodi yuborildi!');
			return data;
		} catch (error) {
			const errorMessage = error.response?.data?.error || 'Parolni tiklashda xatolik yuz berdi';
			toast.error(errorMessage);
			return rejectWithValue(errorMessage);
		}
	}
);

//  PAROLNI TIKLASH (RESET PASSWORD)
export const resetPassword = createAsyncThunk(
	'auth/reset-password',
	async ({ resetToken, newPassword }, { rejectWithValue }) => {
		try {
			const { data } = await api.post(`/auth/reset-password`, {
				resetToken,
				newPassword,
			});
			toast.success(data.message);
			return data;
		} catch (error) {
			const errorMessage =
				error.response?.data?.error || "Parolni o'zgartirishda xatolik yuz berdi";
			toast.error(errorMessage);
			return rejectWithValue(errorMessage);
		}
	}
);
