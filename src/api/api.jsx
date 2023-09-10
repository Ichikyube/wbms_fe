import axios from "axios";
const { REACT_APP_WBMS_BACKEND_API_URL } = process.env;
const api = axios.create({
  baseURL: `${REACT_APP_WBMS_BACKEND_API_URL}`,
});

let refresh = false;
// Add an interceptor to set the 'Authorization' header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("wbms_at");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 401 && !refresh) {
        refresh = true;

        const response = await axios.post('refresh', {}, {withCredentials: true});

        if (response.status === 200) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['token']}`;

            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});

export default api;
