import api from "./client.api";
import { handleApiError } from "./errors.api";

export const getProjectsIdName = async () => {
  try {
    const response = await api.get("/project_id_name/");

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getUsersIDName = async () => {
  try {
    const response = await api.get("/user_id_name/");

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createProject = async (payload) => {
  try {
    const response = await api.post("/project/", payload);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getTasks = async (query_params) => {
  try {
    const response = await api.get("/task/", {
      params: query_params,
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createTask = async (payload) => {
  try {
    const response = await api.post("/task/", payload);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};