import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

// Global Axios Interceptor for 419 Page Expired errors
window.axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 419) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('safescape-session-expired'));
      }
    }
    return Promise.reject(error);
  }
);
