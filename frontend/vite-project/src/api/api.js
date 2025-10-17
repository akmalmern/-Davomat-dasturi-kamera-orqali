import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
	baseURL: 'http://localhost:5000/api',
	withCredentials: true, // This is crucial for HTTP-only cookies
});

let isRefreshing = false;
let failedQueue = [];
let hasShownSessionExpiredMessage = false;

const processQueue = (error, token = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

// Response interceptor for handling token refresh
api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		// Check if error is 401 (Unauthorized) and request hasn't been retried
		if (error.response?.status === 401 && !originalRequest._retry) {
			// Skip refresh for auth endpoints
			const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh-access-token'];
			const isAuthEndpoint = authEndpoints.some(endpoint =>
				originalRequest.url?.includes(endpoint)
			);

			if (isAuthEndpoint) {
				return Promise.reject(error);
			}

			// For profile endpoint, only try refresh if we're not already refreshing
			// and if this isn't the initial app load
			if (originalRequest.url?.includes('/auth/profile')) {
				// Check if we have any indication that user was previously logged in
				const wasLoggedIn =
					document.cookie.includes('refreshToken') ||
					localStorage.getItem('wasLoggedIn') === 'true';

				if (!wasLoggedIn && !isRefreshing) {
					// console.log('👤 Initial profile check - user not logged in');
					return Promise.reject(error);
				}
			}

			if (isRefreshing) {
				// If already refreshing, queue the request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => {
						return api(originalRequest);
					})
					.catch(err => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				// console.log('🔄 Access token tugagan, yangilanmoqda...');
				// Attempt to refresh the access token
				await api.post('/auth/refresh-access-token');

				// console.log('✅ Access token muvaffaqiyatli yangilandi:', response.data);

				processQueue(null);
				return api(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);

				// Only show session expired message once and only if user was actually logged in
				if (!hasShownSessionExpiredMessage && localStorage.getItem('wasLoggedIn') === 'true') {
					hasShownSessionExpiredMessage = true;
					toast.error('Sessiya muddati tugadi. Qayta kiring.');

					// Clear the logged in flag
					localStorage.removeItem('wasLoggedIn');

					// Redirect to login after a short delay
					setTimeout(() => {
						window.location.href = '/login';
					}, 2000);
				}

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export default api;
