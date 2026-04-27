import api from "./client.api";
import { handleApiError } from "./errors.api";

export const getProjects = async () => {
  try {
    const response = await api.get("/project/");

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};