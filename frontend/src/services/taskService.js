import { MOCK } from "./axiosConfig";
import axiosInstance from "./axiosConfig";

let mockTasks = [
  { id: 1, title: "Buy groceries", description: "Milk, eggs, bread", status: "tracking", completed: false },
  { id: 2, title: "Write report", description: "Q2 summary", status: "received", completed: true },
  { id: 3, title: "Fix bug", description: "Login page crash", status: "cancelled", completed: false },
];
let nextId = 4;

export const getTasks = async () => {
  if (MOCK) return [...mockTasks];
  const res = await axiosInstance.get("/api/tasks");
  return res.data;
};

export const getTaskById = async (id) => {
  if (MOCK) {
    const task = mockTasks.find((t) => t.id === Number(id));
    if (!task) throw { response: { status: 404 } };
    return task;
  }
  const res = await axiosInstance.get(`/api/tasks/${id}`);
  return res.data;
};

export const createTask = async (data) => {
  if (MOCK) {
    const task = { id: nextId++, ...data };
    mockTasks.push(task);
    return task;
  }
  const res = await axiosInstance.post("/api/tasks", data);
  return res.data;
};

export const updateTask = async (id, data) => {
  if (MOCK) {
    mockTasks = mockTasks.map((t) => (t.id === Number(id) ? { ...t, ...data } : t));
    return mockTasks.find((t) => t.id === Number(id));
  }
  const res = await axiosInstance.put(`/api/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id) => {
  if (MOCK) {
    const exists = mockTasks.find((t) => t.id === Number(id));
    if (!exists) throw { response: { status: 404 } };
    mockTasks = mockTasks.filter((t) => t.id !== Number(id));
    return;
  }
  await axiosInstance.delete(`/api/tasks/${id}`);
};