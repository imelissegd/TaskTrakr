import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../App";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      return setError("Please enter your username and password.");
    }

    setLoading(true);
    try {
      const res = await login(form);
      setAuth(res.user, res.token);
      navigate(res.user.role === "ADMIN" ? "/admin/users" : "/tasks");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand block */}
        <div className="auth-brand">
          <div className="auth-logo">
            <span className="auth-logo-green">Task</span>
            <span className="auth-logo-blue">Trakr</span>
          </div>
          <span className="auth-tagline">Task Management System</span>
        </div>

        <div className="auth-divider" />
        <h1 className="auth-heading">Login</h1>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>

          <div className="field-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <span className="input-icon">&#128100;</span>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="your_username"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon">&#128274;</span>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2"
          >
            {loading ? "Logging in…" : "Login"}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}