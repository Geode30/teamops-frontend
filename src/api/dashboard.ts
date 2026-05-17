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

type CreateProjectStatus = "active" | "completed";
type CreateProjectPriority = "high" | "medium" | "low";

export type CreateProjectPayload ={
  name: string;
  description: string;
  status: CreateProjectStatus;
  priority: CreateProjectPriority;
  deadline: string | null;
  members: number[];
}

export const createProject = async (payload: CreateProjectPayload) => {
  try {
    const response = await api.post("/project/", payload);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getTasks = async (query_params: Record<string, string | number>) => {
  try {
    const response = await api.get("/task/", {
      params: query_params,
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

type CreateTaskPayload = {
  project: string | number;
  name: string;
  description: string;
  status: string;
  assigned_to: number | null;
}

export const createTask = async (payload: CreateTaskPayload) => {
  try {
    const response = await api.post("/task/", payload);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const partialUpdateTask = async <T extends object>(
  payload: T,
  taskId: number
  ) => {
    try {
      const response = await api.patch(`/task/${taskId}/`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
};

export const createProgressNote = async (payload: {task: number, note: string}) => {
  try {
    const response = await api.post("/progress_note/", payload);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getProgressNotes = async (query_params: Record<string, string | number>) => {
  try {
    const response = await api.get("/progress_note/", {
      params: query_params,
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};