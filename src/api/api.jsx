import axios from "axios";

const { REACT_APP_WBMS_BACKEND_API_URL } = process.env;

export const api = axios.create({
  baseURL: `${REACT_APP_WBMS_BACKEND_API_URL}`,
});

const endpoint = "/app/resourceslist";

export const getResourceslist = async () => {
  const response = await api.get(endpoint);
  return response.data;
};
