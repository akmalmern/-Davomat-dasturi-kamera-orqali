import { createSlice } from '@reduxjs/toolkit';
import { xodimlar, xodimQoshish, updateXodim, deleteXodim } from './xodimlarThunk';

const initialState = {
	xodimlar: [],
	loading: false,
	error: null,
	success: false,
};

const xodimlarSlice = createSlice({
	name: 'xodimlar',
	initialState,
	reducers: {
		resetXodimlarState: state => {
			state.success = false;
			state.error = null;
		},
	},
	extraReducers: builder => {
		//  Xodimlarni olish
		builder
			.addCase(xodimlar.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(xodimlar.fulfilled, (state, action) => {
				state.loading = false;
				state.xodimlar = action.payload.xodimlar;
			})
			.addCase(xodimlar.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(xodimQoshish.pending, state => {
				state.loading = true;
				state.error = null;
				state.success = false;
			})
			.addCase(xodimQoshish.fulfilled, (state, action) => {
				state.loading = false;
				state.success = true;

				// xavfsizlik uchun
				if (!Array.isArray(state.xodimlar)) {
					state.xodimlar = [];
				}

				// backenddan xodim shu tarzda keladi
				state.xodimlar = [...state.xodimlar, action.payload.xodim];
			})

			.addCase(xodimQoshish.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				state.success = false;
			})
			.addCase(updateXodim.fulfilled, (state, action) => {
				state.loading = false;
				state.success = true;
				state.xodimlar = state.xodimlar.map(x =>
					x._id === action.payload._id ? action.payload : x
				);
			})

			//  o‘chirish
			.addCase(deleteXodim.fulfilled, (state, action) => {
				state.xodimlar = state.xodimlar.filter(x => x._id !== action.payload);
			});
	},
});

export const { resetXodimlarState } = xodimlarSlice.actions;
export default xodimlarSlice.reducer;
