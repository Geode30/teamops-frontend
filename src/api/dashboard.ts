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