import api from "./api";

export const endpoint = "/configs";

export const getAll = async () => {
  const response = await api.get(endpoint);
  return response?.data;
};

export const getById = async (id) => {
  const response = await api.get(`${endpoint}/${id}`);
  return response?.data;
};

export const create = async (data) => {
  const response = await api.post(endpoint, data);
  return response?.data;
};

export const update = async (data) => {
  const response = await api.patch(`${endpoint}/${data.id}`, data);
  return response?.data;
};
export const updateFunction = async (data) => {
  const response = await api.post(
    `${endpoint}/${data.id}/edit-function`,
    data
  );
  return response?.data;
};
export const deleteById = async (id) => {
  const response = await api.delete(`${endpoint}/${id}`);
  return response?.data;
};

export const getEnv = async () => {
  const response = await api.get("configs/env");

  return response?.data?.data?.ENV;
};

export const getVA_SCC_MODEL = () => {
  const response = {
    data: [
      { id: 0, value: "None" },
      { id: 1, value: "Mass Balance" },
      { id: 2, value: "Segregated" },
      { id: 3, value: "Identity Preserved" },
    ],
  };
  return response?.data;
};

export const getRSPO_SCC_MODEL = () => {
  const response = {
    data: [
      { id: 0, value: "None" },
      { id: 1, value: "Mass Balance" },
      { id: 2, value: "Segregated" },
      { id: 3, value: "Identity Preserved" },
    ],
  };
  return response?.data;
};

export const getISCC_SCC_MODEL = () => {
  const response = {
    data: [
      { id: 0, value: "None" },
      { id: 1, value: "Mass Balance" },
      { id: 2, value: "Segregated" },
      { id: 3, value: "Identity Preserved" },
    ],
  };
  return response?.data;
};

//Modul Instalasasi
