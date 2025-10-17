import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { toast } from 'react-toastify';

//  Smena qo‘shish
export const addSmena = createAsyncThunk(
	'smena/addSmena',
	async (formData, { rejectWithValue }) => {
		try {
			const { data } = await api.post('/smena/add-smena', formData);
			toast.success(data.message);
			return data.smena;
		} catch (error) {
			toast.error(error.response?.data?.error || 'Xatolik yuz berdi');
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

//  Barcha smenalarni olish
export const getSmenalar = createAsyncThunk('smena/getSmenalar', async (_, { rejectWithValue }) => {
	try {
		const { data } = await api.get('/smena/smenalar');
		return data.smen;
	} catch (error) {
		toast.error('Smenalarni olishda xatolik');
		return rejectWithValue(error.response?.data?.error);
	}
});

//  Smena o‘chirish
export const deleteSmena = createAsyncThunk(
	'smena/deleteSmena',
	async (id, { rejectWithValue }) => {
		try {
			const { data } = await api.delete(`/smena/delete-smena/${id}`);
			toast.success(data.message);
			return id; // o‘chirilgan ID ni qaytaramiz
		} catch (error) {
			toast.error(error.response?.data?.error || 'Xatolik yuz berdi');
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

// Smena yangilash
export const updateSmena = createAsyncThunk(
	'smena/updateSmena',
	async ({ id, formData }, { rejectWithValue }) => {
		try {
			const { data } = await api.put(`/smena/update-smena/${id}`, formData);
			toast.success(data.message);
			return data.upSmena;
		} catch (error) {
			toast.error(error.response?.data?.error || 'Xatolik yuz berdi');
			return rejectWithValue(error.response?.data?.error);
		}
	}
);
