import { handleApiError } from "./errors.api";
import publicApi from "./client.public.api";
import api from "./client.api";

export interface SignupPayload {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export const signup = async (payload: SignupPayload) => {
  try {
    const response = await publicApi.post("/signup/", payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const login = async (payload: LoginPayload) => {
  try {
    const response = await publicApi.post("/login/", payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/logout/");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const refreshToken = async () => {
  try {
    const response = await publicApi.post("/token/refresh/");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const currentUser = async () => {
  try {
    const response = await api.get("/me/user/");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};