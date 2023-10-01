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
api.interceptors.response?.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401 && !refresh) {
      refresh = true;
      const rt = getCookie("rt");
      try {
        const response = await api.post("/auth/refresh", rt, {
          withCredentials: true,
        });
        if (response?.status === 200) {
          const at = response?.data?.data.tokens["access_token"];
          localStorage.setItem("wbms_at", at);
          document.cookie =
            "rt=" +
            response?.data?.data.tokens["refresh_token"] +
            "; SameSite=Lax";
          const config = error.config;
          api.defaults.headers.common["Authorization"] = `Bearer ${at}`;
          config.headers.Authorization = `Bearer ${at}`;
          return axios(config);
        } 
      } catch (_error) {
        return Promise.reject(_error);
      }
    }

    refresh = false;
    return error;
  }
);

export function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return value;
    }
  }
  return null;
}
export default api;
