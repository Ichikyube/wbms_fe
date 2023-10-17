import api from "./api";

export const endpoint = "temporary-data";

export const getAllTransactions = async () => {
  try {
    const response = await api.get(`${endpoint}/transactions`);
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      data: {
        error: error,
      },
    };
  }
};

export const createReqData = async (data) => {
  const response = await api.post(`${endpoint}/transaction`, data);
  return response?.data;
};

export const createTrxData = async (data) => {
  const response = await api.post(`${endpoint}/transaction`, data);

  return response?.data;
};

export const createManyTrxData = async (data) => {
  const response = await api.post(`${endpoint}/many-transaction`, data);

  return response?.data;
};

export const submitTemporaryData = async (data) => {
  const response = await api.post(`${endpoint}/transaction`, data);

  return response?.data;
};
export const deleteAllTemporaryTransactionsData = async (data) => {
  const response = await api.post(`${endpoint}/many-transaction`, data);

  return response?.data;
};
export const deleteTemporaryTransactionsData = async (data) => {
  const response = await api.patch(`${endpoint}/${data?.id}`, data);
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
