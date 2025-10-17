import { createSlice } from '@reduxjs/toolkit';
import { addSmena, getSmenalar, deleteSmena, updateSmena } from './smenaThunk';

const initialState = {
	smenalar: [],
	loading: false,
	error: null,
	success: false,
};

const smenaSlice = createSlice({
	name: 'smena',
	initialState,
	reducers: {
		resetSmenaState: state => {
			state.loading = false;
			state.error = null;
			state.success = false;
		},
	},
	extraReducers: builder => {
		builder
			// Smena qo‘shish
			.addCase(addSmena.pending, state => {
				state.loading = true;
			})
			.addCase(addSmena.fulfilled, (state, action) => {
				state.loading = false;
				state.success = true;
				state.smenalar.push(action.payload);
			})
			.addCase(addSmena.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// 📥 Smenalarni olish
			.addCase(getSmenalar.pending, state => {
				state.loading = true;
			})
			.addCase(getSmenalar.fulfilled, (state, action) => {
				state.loading = false;
				state.smenalar = action.payload;
			})
			.addCase(getSmenalar.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			//  O‘chirish
			.addCase(deleteSmena.fulfilled, (state, action) => {
				state.smenalar = state.smenalar.filter(item => item._id !== action.payload);
			})

			//  Yangilash
			.addCase(updateSmena.fulfilled, (state, action) => {
				state.smenalar = state.smenalar.map(item =>
					item._id === action.payload._id ? action.payload : item
				);
			});
	},
});

export const { resetSmenaState } = smenaSlice.actions;
export default smenaSlice.reducer;
