import { MOCK } from "./axiosConfig";
import axiosInstance from "./axiosConfig";

let mockTasks = [
  { taskId: 1, title: "Buy groceries", description: "Milk, eggs, bread", status: "Pending" },
  { taskId: 2, title: "Write report",  description: "Q2 summary",        status: "Completed" },
  { taskId: 3, title: "Fix bug",       description: "Login page crash",   status: "Cancelled" },
];
let nextId = 4;

export const getTasks = async ({ page = 0, size = 10, title, status, deadlineFrom, deadlineTo } = {}) => {
  if (MOCK) {
    return {
      content: [...mockTasks],
      totalElements: mockTasks.length,
      totalPages: 1,
      number: 0,
    };
  }
  const res = await axiosInstance.get("/api/tasks", {
    params: { page, size, title, status, deadlineFrom, deadlineTo },
  });
  return res.data;
};
export const getTaskById = async (id) => {
  if (MOCK) {
    const task = mockTasks.find((t) => t.taskId === Number(id));
    if (!task) throw { response: { status: 404 } };
    return task;
  }
  const res = await axiosInstance.get(`/api/tasks/${id}`);
  return res.data;
};

export const createTask = async (data) => {
  if (MOCK) {
    const task = { taskId: nextId++, ...data };
    mockTasks.push(task);
    return task;
  }
  const res = await axiosInstance.post("/api/tasks", data);
  return res.data;
};

export const updateTask = async (id, data) => {
  if (MOCK) {
    mockTasks = mockTasks.map((t) => (t.taskId === Number(id) ? { ...t, ...data } : t));
    return mockTasks.find((t) => t.taskId === Number(id));
  }
  const res = await axiosInstance.put(`/api/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id) => {
  if (MOCK) {
    const exists = mockTasks.find((t) => t.taskId === Number(id));
    if (!exists) throw { response: { status: 404 } };
    mockTasks = mockTasks.filter((t) => t.taskId !== Number(id));
    return;
  }
  await axiosInstance.delete(`/api/tasks/${id}`);
};