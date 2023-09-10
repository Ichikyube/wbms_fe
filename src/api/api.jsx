import axios from "axios";
import Cookies from "js-cookie";
const { REACT_APP_WBMS_BACKEND_API_URL } = process.env;
const api = axios.create({
  baseURL: `${REACT_APP_WBMS_BACKEND_API_URL}`,
});

// Add an interceptor to set the 'Authorization' header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("wbms_at");
    console.log();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;