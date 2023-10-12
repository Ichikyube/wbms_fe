import api from "./api";

export const endpoint = "temporary-data";

export const getAll = async () => {
  const response = await api.get(`${endpoint}`).catch((error) => {
    return {
      status: false,
      message: error.message,
      data: {
        error: error,
      },
    };
  });

  return response?.data;
};

export const getById = async (id) => {
  const response = await api.get(`${endpoint}/${id}`);
  return response?.data;
};

export const searchMany = async (query) => {
  const response = await api
    .post(`${endpoint}/search-many`, query)
    .then((res) => res.data);
  return response;
};

export const searchFirst = async (query) => {
  const response = await api.post(`${endpoint}/search-first`, query);
  return response?.data;
};

export const create = async (data) => {
  const response = await api.post(`${endpoint}/transaction`, data);

  return response?.data;
};
export const createMany = async (data) => {
  const response = await api.post(`${endpoint}/many-transaction`, data);

  return response?.data;
};
export const update = async (data) => {
  const response = await api.patch(`${endpoint}/${data?.id}`, data);
  return response?.data;
};

export const deleteById = async (id) => {
  const response = await api.delete(`${endpoint}/${id}`);
  return response?.data;
};
