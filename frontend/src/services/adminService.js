import { MOCK } from "./axiosConfig";
import axiosInstance from "./axiosConfig";

let mockUsers = [
  { userId: 1, firstname: "Alice",  middlename: "",      lastname: "Smith",   username: "alice",  email: "alice@example.com",  role: "User",  active: true  },
  { userId: 2, firstname: "Bob",    middlename: "James", lastname: "Jones",   username: "bob",    email: "bob@example.com",    role: "User",  active: true  },
  { userId: 3, firstname: "Carol",  middlename: "",      lastname: "Admin",   username: "carol",  email: "carol@example.com",  role: "Admin", active: true  },
  { userId: 4, firstname: "Dave",   middlename: "",      lastname: "Deactivated", username: "dave", email: "dave@example.com", role: "User",  active: false },
];

let mockAdminTasks = [
  { taskId: 1, title: "Buy groceries",  description: "Milk, eggs, bread", status: "Pending",   username: "alice" },
  { taskId: 2, title: "Write report",   description: "Q2 summary",        status: "Completed", username: "bob"   },
  { taskId: 3, title: "Fix bug",        description: "Login page crash",   status: "Cancelled", username: "alice" },
  { taskId: 4, title: "Deploy to prod", description: "Friday release",     status: "Pending",   username: "carol" },
];

// ── Users ──────────────────────────────────────────────────────

export const adminGetAllUsers = async ({
  page = 0,
  size = 10,
  name,
  email,
  role,
  active,
} = {}) => {
  if (MOCK) {
    // Client-side mock filtering/pagination
    let filtered = [...mockUsers];

    if (name) {
      filtered = filtered.filter(u =>
        `${u.firstname} ${u.middlename} ${u.lastname}`.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (email) filtered = filtered.filter(u => u.email.toLowerCase().includes(email.toLowerCase()));
    if (role) filtered = filtered.filter(u => u.role === role);
    if (active !== undefined) filtered = filtered.filter(u => u.active === active);

    const start = page * size;
    const end = start + size;
    return {
      content: filtered.slice(start, end),
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      last: page >= Math.ceil(filtered.length / size) - 1,
    };
  }

  // Backend call with query params
  const params = { page, size, name, email, role, active };
  const res = await axiosInstance.get("/api/admin/users", { params });
  return res.data; // Should return FilterResponseDTO<UserResponseDTO>
};

export const adminGetUserById = async (userId) => {
  if (MOCK) {
    const user = mockUsers.find((u) => u.userId === Number(userId));
    if (!user) throw { response: { status: 404 } };
    return user;
  }
  const res = await axiosInstance.get(`/api/admin/users/${userId}`);
  return res.data;
};

export const adminUpdateUser = async (userId, data) => {
  if (MOCK) {
    mockUsers = mockUsers.map((u) =>
      u.userId === Number(userId) ? { ...u, ...data } : u
    );
    return mockUsers.find((u) => u.userId === Number(userId));
  }
  const res = await axiosInstance.put(`/api/admin/users/${userId}`, data);
  return res.data;
};

export const adminUpdateUserRole = async (userId, role) => {
  if (MOCK) {
    mockUsers = mockUsers.map((u) =>
      u.userId === Number(userId) ? { ...u, role } : u
    );
    return mockUsers.find((u) => u.userId === Number(userId));
  }
  const res = await axiosInstance.patch(`/api/admin/users/${userId}/role?role=${role}`);
  return res.data;
};

export const adminDeactivateUser = async (userId) => {
  if (MOCK) {
    mockUsers = mockUsers.map((u) =>
      u.userId === Number(userId) ? { ...u, active: false } : u
    );
    return;
  }
  await axiosInstance.patch(`/api/admin/users/${userId}/deactivate`);
};

export const adminReactivateUser = async (userId) => {
  if (MOCK) {
    mockUsers = mockUsers.map((u) =>
      u.userId === Number(userId) ? { ...u, active: true } : u
    );
    return;
  }
  await axiosInstance.patch(`/api/admin/users/${userId}/reactivate`);
};

// ── Tasks ──────────────────────────────────────────────────────

export const adminGetAllTasks = async ({
  page = 0,
  size = 10,
  title,
  status,
  userId,
} = {}) => {
  if (MOCK) {
    let filtered = [...mockAdminTasks];

    if (title) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }
    if (userId) {
      filtered = filtered.filter(t => t.userId === userId || t.username === mockUsers.find(u => u.userId === userId)?.username);
    }

    const start = page * size;
    const end = start + size;

    return {
      content: filtered.slice(start, end),
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      last: page >= Math.ceil(filtered.length / size) - 1,
    };
  }

  const res = await axiosInstance.get("/api/admin/tasks", { params: { page, size, title, status, userId } });
  return res.data;
};

export const adminGetTaskById = async (taskId) => {
  if (MOCK) {
    const task = mockAdminTasks.find((t) => t.taskId === Number(taskId));
    if (!task) throw { response: { status: 404 } };
    return task;
  }
  const res = await axiosInstance.get(`/api/admin/tasks/${taskId}`);
  return res.data;
};