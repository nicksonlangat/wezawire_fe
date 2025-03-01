import useAxiosInstance from "./axiosInstance";


export const useApi = () => {
  const axiosInstance = useAxiosInstance();

  const createUser = async (data: object) => {
    const response = await axiosInstance.post(`accounts/auth/register/`, data);
    return response.data;
  };

  const loginUser = async (data: object) => {
    const response = await axiosInstance.post(`accounts/auth/login/`, data);
    return response.data;
  };

  const getUser = async () => {
    const response = await axiosInstance.get(`accounts/auth/me/`);
    return response.data;
  };

  const fetchJournalists = async (page = 1, search = "") => {
    const response = await axiosInstance.get(`journalists/`, {
      params: { page, search },
    });
    return response.data;
  };

  const addJournalist = async (data: object) => {
    const response = await axiosInstance.post(`journalists/`, data);
    return response.data;
  };

  const uploadJournalists = async (formData: object ) => {
    try {
      const response = await axiosInstance.post('upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading journalists:', error);
      throw error;
    }
  };

  const updateJournalist = async (id: string, data: object) => {
    const response = await axiosInstance.patch(`journalists/${id}/`, data);
    return response.data;
  };

  const deleteJournalist = async (id: string) => {
    const response = await axiosInstance.delete(`journalists/${id}/`);
    return response.data;
  };


  const fetchClients = async (page = 1, search = "") => {
      const response = await axiosInstance.get(`clients/`, {
        params: { page, search },
      });
      return response.data;
    };

  
    const addClient = async (data: object) => {
      const response = await axiosInstance.post(`clients/`, data);
      return response.data;
    };

    const updateClient = async (id: string, data: object) => {
      const response = await axiosInstance.patch(`clients/${id}/`, data);
      return response.data;
    };

    const deleteClient = async (id: string) => {
      const response = await axiosInstance.delete(`clients/${id}/`);
      return response.data;
    };

  const generatePressRelease = async (data: object) => {
    const response = await axiosInstance.post(`generate-press-release/`, data);
    return response.data;
  };

  const createPressRelease = async (data: object) => {
    const response = await axiosInstance.post(`press-releases/`, data);
    return response.data;
  };

  const fetchPressReleases = async (page = 1, search = "") => {
    const response = await axiosInstance.get(`press-releases/`, {
      params: { page, search },
    });
    return response.data;
  };

  const fetchPressRelease = async (
    id: string
  ) => {
    const response = await axiosInstance.get(`press-releases/${id}/`);
    return response.data;
  };

  const patchPressRelease = async (
    id: string, data: object
  ) => {
    const response = await axiosInstance.patch(`press-releases/${id}/`, data);
    return response.data;
  };

  const deletePressRelease = async (
    id: string
  ) => {
    const response = await axiosInstance.delete(`press-releases/${id}/`);
    return response.data;
  };

  const previewPressRelease = async (
    data: object
  ) => {
    const response = await axiosInstance.post(`preview-press-release/`, data);
    return response.data;
  };

  const downloadPressRelease = async (
    data: object
  ) => {
    const response = await axiosInstance.post(`download-press-release/`, data);
    return response.data;
  };

  const distributePressRelease = async (
    data: object
  ) => {
    const response = await axiosInstance.post(`distribute-press-release/`, data);
    return response.data;
  };
  

  return {
    // accounts
    createUser,
    loginUser,
    getUser,

    // clients and journalists
    fetchJournalists,
    addJournalist,
    updateJournalist,
    deleteJournalist,
    uploadJournalists,

    addClient,
    updateClient,
    deleteClient,
    fetchClients,
   
    // press releases
    createPressRelease,
    fetchPressReleases,
    generatePressRelease,
    fetchPressRelease,
    patchPressRelease,
    deletePressRelease,
    previewPressRelease,
    downloadPressRelease,
    distributePressRelease
  };
};
