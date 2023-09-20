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
// Add an interceptor to refresh token when it's expired
api.interceptors.response.use((response) => {
  return response;
}, async (error) => {
    if (error.response.status === 401 && !refresh) {
        refresh = true;
        const rt =  getCookie("at");
        const response = await api.post('/auth/refresh', rt, {withCredentials: true});
        if (response.status === 200) {
          console.log(response)
          localStorage.setItem("wbms_at", response.data['token']);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data['token']}`;

          return axios(error.config);
        }
    }
    refresh = false;
    return error;
});

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
}
export default api;