import { createSlice } from '@reduxjs/toolkit';
import {
	checkInDavomat,
	checkOutDavomat,
	getHozirdaIshda,
	getKunlikHisobot,
	getSmenaHisoboti,
	getXodimDavomatTarixi,
} from './davomatThunk';

const initialState = {
	loading: false,
	error: null,
	success: false,
	message: '',
	data: null,
	davomat: [],
	statistika: null,
	xodim: null,
	davr: null,
	kunlikHisobot: null,
	smenaHisoboti: null,
	hozirdaIshda: null,
};

const davomatSlice = createSlice({
	name: 'davomat',
	initialState,
	reducers: {
		resetDavomat: state => {
			state.loading = false;
			state.error = null;
			state.success = false;
			state.message = '';
			state.data = null;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(checkInDavomat.pending, state => {
				state.loading = true;
				state.error = null;
				state.success = false;
				state.message = '';
				state.data = null;
			})
			.addCase(checkInDavomat.fulfilled, (state, action) => {
				state.loading = false;
				state.success = true;
				state.message = action.payload.message;
				state.data = action.payload;
			})
			.addCase(checkInDavomat.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				state.success = false;
			})

			.addCase(checkOutDavomat.pending, state => {
				state.loading = true;
				state.error = null;
				state.success = false;
			})
			.addCase(checkOutDavomat.fulfilled, (state, action) => {
				state.loading = false;
				state.success = true;
				state.message = action.payload.message;
				state.data = action.payload;
			})
			.addCase(checkOutDavomat.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getXodimDavomatTarixi.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getXodimDavomatTarixi.fulfilled, (state, action) => {
				state.loading = false;
				state.davomat = action.payload.davomat;
				state.statistika = action.payload.statistika;
				state.xodim = action.payload.xodim;
				state.davr = action.payload.davr;
			})
			.addCase(getXodimDavomatTarixi.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			//  Kunlik hisobot
			.addCase(getKunlikHisobot.pending, state => {
				state.loading = true;
			})
			.addCase(getKunlikHisobot.fulfilled, (state, action) => {
				state.loading = false;
				state.kunlikHisobot = action.payload;
			})
			.addCase(getKunlikHisobot.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			//  Smena hisobot
			.addCase(getSmenaHisoboti.pending, state => {
				state.loading = true;
			})
			.addCase(getSmenaHisoboti.fulfilled, (state, action) => {
				state.loading = false;
				state.smenaHisoboti = action.payload;
			})
			.addCase(getSmenaHisoboti.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			//  Hozirda ishda
			.addCase(getHozirdaIshda.pending, state => {
				state.loading = true;
			})
			.addCase(getHozirdaIshda.fulfilled, (state, action) => {
				state.loading = false;
				state.hozirdaIshda = action.payload;
			})
			.addCase(getHozirdaIshda.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { resetDavomat } = davomatSlice.actions;
export default davomatSlice.reducer;
