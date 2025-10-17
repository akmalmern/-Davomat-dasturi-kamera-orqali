import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { toast } from 'react-toastify';

export const xodimlar = createAsyncThunk('admin/xodimlar', async (_, { rejectWithValue }) => {
	try {
		const { data } = await api.get('/admin/xodimlar');
		return data;
	} catch (error) {
		toast.error(error.response?.data?.error);
		return rejectWithValue(error.response?.data?.error);
	}
});

export const xodimQoshish = createAsyncThunk(
	'admin/xodimQoshish',
	async (formData, { rejectWithValue }) => {
		try {
			const { data } = await api.post('/admin/xodim-qoshish', formData);
			toast.success(data.message);
			return data;
		} catch (error) {
			toast.error(error.response?.data?.error);
			return rejectWithValue(error.response?.data?.error);
		}
	}
);
//  Xodim yangilash
export const updateXodim = createAsyncThunk(
	'admin/updateXodim',
	async ({ id, formData }, { rejectWithValue }) => {
		try {
			const { data } = await api.put(`/admin/update-xodim/${id}`, formData);
			toast.success(data.message);
			return data.xodim;
		} catch (error) {
			toast.error(error.response?.data?.error);
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

//  Xodim o‘chirish
export const deleteXodim = createAsyncThunk(
	'admin/deleteXodim',
	async (id, { rejectWithValue }) => {
		try {
			const { data } = await api.delete(`/admin/delete-xodim/${id}`);
			console.log(data);
			toast.success(data.message);
			return id;
		} catch (error) {
			toast.error(error.response?.data?.error);
			return rejectWithValue(error.response?.data?.error);
		}
	}
);
