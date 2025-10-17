import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

//  Davomatga rasm yuborish thunk
export const checkInDavomat = createAsyncThunk(
	'davomat/checkIn',
	async (file, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			formData.append('image', file);

			const res = await api.post('/davomat/check-in', formData);
			return res.data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error || 'Server bilan aloqa xatosi');
		}
	}
);

//  Ishdan chiqish (Check-out)
export const checkOutDavomat = createAsyncThunk(
	'davomat/checkOut',
	async (file, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			formData.append('image', file);

			const res = await api.post('/davomat/check-out', formData);
			return res.data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error || 'Ishdan chiqishda xatolik yuz berdi');
		}
	}
);

export const getXodimDavomatTarixi = createAsyncThunk(
	'davomat/getXodimDavomatTarixi',
	async ({ id, boshlanish, tugash }, { rejectWithValue }) => {
		try {
			const params = {};
			if (boshlanish) params.boshlanish = boshlanish;
			if (tugash) params.tugash = tugash;

			const { data } = await api.get(`/davomat/xodim-davomat-tarixi/${id}`, { params });
			return data;
		} catch (err) {
			return rejectWithValue(
				err.response?.data?.error || 'Xodim davomatini olishda xatolik yuz berdi'
			);
		}
	}
);
//  Kunlik hisobot
export const getKunlikHisobot = createAsyncThunk(
	'davomat/getKunlikHisobot',
	async (sana, { rejectWithValue }) => {
		try {
			const { data } = await api.get('/davomat/kunlik-hisobot', {
				params: { sana },
			});
			return data.hisobot;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error || 'Kunlik hisobotni olishda xatolik');
		}
	}
);

// Smena bo‘yicha hisobot
export const getSmenaHisoboti = createAsyncThunk(
	'davomat/getSmenaHisoboti',
	async ({ id, sana }, { rejectWithValue }) => {
		try {
			const { data } = await api.get(`/davomat/smena-hisoboti/${id}`, {
				params: { sana },
			});
			return data.hisobot;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error || 'Smena hisoboti xatosi');
		}
	}
);

//  Hozirda ishda bo‘lganlar
export const getHozirdaIshda = createAsyncThunk(
	'davomat/getHozirdaIshda',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await api.get('/davomat/hozir-ishda');
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || 'Hozirda ishda bo‘lganlarni olishda xatolik'
			);
		}
	}
);
