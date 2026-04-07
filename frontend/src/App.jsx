import { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { logout as logoutService } from "./services/authService";

import Navbar               from "./components/Navbar";
import LoginPage            from "./components/auth/LoginPage";
import RegisterPage         from "./components/auth/RegisterPage";
import AccountDetailsPage   from "./components/user/AccountDetailsPage";
import TaskListPage         from "./components/user/TaskListPage";
import TaskDetailPage       from "./components/user/TaskDetailPage";
import AddTaskPage          from "./components/user/AddTaskPage";
import EditTaskPage         from "./components/user/EditTaskPage";
import AdminUsersPage       from "./components/admin/AdminUsersPage";
import AdminTasksPage       from "./components/admin/AdminTasksPage";
import AdminUserDetailPage  from "./components/admin/AdminUserDetailPage";
import AdminTaskDetailPage  from "./components/admin/AdminTaskDetailPage";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser  = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user",  JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// S-03: wrong role redirects to that role's home, not just /tasks
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === "Admin" ? "/admin/users" : "/tasks"} replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/"         element={<Navigate to="/tasks" replace />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login"    element={<LoginPage />} />

            {/* User routes */}
            <Route path="/account"        element={<ProtectedRoute><AccountDetailsPage /></ProtectedRoute>} />
            <Route path="/tasks"          element={<ProtectedRoute><TaskListPage /></ProtectedRoute>} />
            <Route path="/tasks/add"      element={<ProtectedRoute><AddTaskPage /></ProtectedRoute>} />
            <Route path="/tasks/edit/:id" element={<ProtectedRoute><EditTaskPage /></ProtectedRoute>} />
            <Route path="/tasks/:id"      element={<ProtectedRoute><TaskDetailPage /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin/users"         element={<ProtectedRoute requiredRole="Admin"><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/users/:userId" element={<ProtectedRoute requiredRole="Admin"><AdminUserDetailPage /></ProtectedRoute>} />
            <Route path="/admin/tasks"         element={<ProtectedRoute requiredRole="Admin"><AdminTasksPage /></ProtectedRoute>} />
            <Route path="/admin/tasks/:taskId" element={<ProtectedRoute requiredRole="Admin"><AdminTaskDetailPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}