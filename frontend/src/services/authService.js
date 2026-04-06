import { MOCK } from "./axiosConfig";
import axiosInstance from "./axiosConfig";

const MOCK_USER = {
  id: 1,
  username: "mockuser",
  email: "mock@example.com",
  role: "USER",
};

export const register = async (data) => {
  if (MOCK) return { ...MOCK_USER, ...data };
  const res = await axiosInstance.post("/api/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  if (MOCK) {
    const user = { ...MOCK_USER, username: data.username, role: data.role || "USER" };
    localStorage.setItem("token", "mock-jwt-token");
    localStorage.setItem("user", JSON.stringify(user));
    return { token: "mock-jwt-token", user };
  }
  const res = await axiosInstance.post("/api/auth/login", data);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const editAccount = async (data) => {
  if (MOCK) {
    const existing = JSON.parse(localStorage.getItem("user") || "{}");
    const updated = { ...existing, ...data };
    localStorage.setItem("user", JSON.stringify(updated));
    return updated;
  }
  const res = await axiosInstance.post("/api/auth/edit", data);
  return res.data;
};