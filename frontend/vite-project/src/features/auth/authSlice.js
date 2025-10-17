import { createSlice } from '@reduxjs/toolkit';
import { login, logOut, profile, forgotPassword, resetPassword } from './authThunk';

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		isLogged: false,
		loading: false,
		error: null,

		forgotPasswordSuccess: false, // Parolni unutish muvaffaqiyatli
		resetPasswordSuccess: false, // Parolni tiklash muvaffaqiyatli
	},
	reducers: {
		setCredentials: (state, action) => {
			const { user } = action.payload;
			if (user) {
				state.user = user;
				state.isLogged = true;
				localStorage.setItem('wasLoggedIn', 'true');
			}
		},
		logout: state => {
			state.user = null;
			state.isLogged = false;
			state.error = null;
			localStorage.removeItem('wasLoggedIn');
		},
		clearError: state => {
			state.error = null;
		},

		// Forgot password success holatini tozalash
		clearForgotPasswordSuccess: state => {
			state.forgotPasswordSuccess = false;
		},

		// Reset password success holatini tozalash
		clearResetPasswordSuccess: state => {
			state.resetPasswordSuccess = false;
		},
	},
	extraReducers: builder => {
		builder
			// Login cases
			.addCase(login.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.isLogged = true;
				state.error = null;

				localStorage.setItem('wasLoggedIn', 'true');
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || action.error.message;
				state.user = null;
				state.isLogged = false;
			})

			// Profile cases
			.addCase(profile.pending, state => {
				state.loading = true;
			})
			.addCase(profile.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
				state.isLogged = true;
				state.error = null;

				// Mark that user is logged in
				localStorage.setItem('wasLoggedIn', 'true');
			})
			.addCase(profile.rejected, state => {
				state.loading = false;
				state.user = null;
				state.isLogged = false;
			})

			// Logout cases
			.addCase(logOut.pending, state => {
				state.loading = true;
			})
			.addCase(logOut.fulfilled, state => {
				state.loading = false;
				state.user = null;
				state.isLogged = false;
				state.error = null;

				// Clear the logged in flag
				localStorage.removeItem('wasLoggedIn');
			})
			.addCase(logOut.rejected, state => {
				state.loading = false;
				// Even if logout fails on server, clear local state
				state.user = null;
				state.isLogged = false;

				// Clear the logged in flag
				localStorage.removeItem('wasLoggedIn');
			})
			.addCase(forgotPassword.pending, state => {
				state.loading = true;
				state.error = null;
				state.forgotPasswordSuccess = false;
			})
			.addCase(forgotPassword.fulfilled, state => {
				state.loading = false;
				state.error = null;
				state.forgotPasswordSuccess = true; // Muvaffaqiyatli yuborildi
			})
			.addCase(forgotPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || action.error.message;
				state.forgotPasswordSuccess = false;
			})

			// PAROLNI TIKLASH (RESET PASSWORD) amallari
			.addCase(resetPassword.pending, state => {
				state.loading = true;
				state.error = null;
				state.resetPasswordSuccess = false;
			})
			.addCase(resetPassword.fulfilled, state => {
				state.loading = false;
				state.error = null;

				state.resetPasswordSuccess = true; // Parol muvaffaqiyatli o'zgartirildi
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || action.error.message;
				state.resetPasswordSuccess = false;
			});
	},
});

export const {
	setCredentials,
	logout,
	clearError,
	clearForgotPasswordSuccess,
	clearResetPasswordSuccess,
} = authSlice.actions;
export default authSlice.reducer;
