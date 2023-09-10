import { api } from "./api";
export const login = async (username, password) => {
  await api.post("signin", {username, password}).then(response => {
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  });
};

export const logout = async () => {
    localStorage.removeItem("user");
};

export const register = async (username, email, password) => {
    const response = await api.post("signup", {username, email, password});
    return response.data;
};

export const getCurrentUser = async (data) => {
    return JSON.parse(localStorage.getItem('user'));
};
