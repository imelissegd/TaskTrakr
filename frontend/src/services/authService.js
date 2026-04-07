import { MOCK } from "./axiosConfig";
import axiosInstance from "./axiosConfig";

const MOCK_USER = {
  userId:     1,
  firstname:  "Mock",
  middlename: "",
  lastname:   "User",
  username:   "mockuser",
  email:      "mock@example.com",
  role:       "User",
  active:     true,
};

export const register = async (data) => {
  if (MOCK) return { ...MOCK_USER, ...data };
  const res = await axiosInstance.post("/api/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  if (MOCK) {
    const user = {
      ...MOCK_USER,
      username: data.username,
      role: data.username === "admin" ? "Admin" : "User",
    };
    localStorage.setItem("token", "mock-jwt-token");
    localStorage.setItem("user", JSON.stringify(user));
    return { token: "mock-jwt-token", user };
  }

  // Real: login → get token → fetch full user profile
  const loginRes = await axiosInstance.post("/api/auth/login", data);
  const { token } = loginRes.data;
  localStorage.setItem("token", token);

  const profileRes = await axiosInstance.get("/api/users/me");
  const user = profileRes.data;
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
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
  const res = await axiosInstance.put("/api/users/me", data);
  return res.data;
};