import api from "./client.api";
import { handleApiError } from "./errors.api";

export interface UpdateCredentialsPayload {
    username: string,
    password: string,
    confirm_password: string
}

export interface UpdateUserPayload {
  first_name: string,
  last_name: string
}

export const updateCredentials = async (id: number, payload: UpdateCredentialsPayload) => {
  try {
    const response = await api.put(`/update_credentials/${id}/`, payload);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateUser = async (id: number, payload: UpdateUserPayload) => {
  try {
    const response = await api.put(`/user/${id}/`, payload);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};