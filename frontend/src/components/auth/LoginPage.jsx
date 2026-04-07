import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginService } from "../../services/authService";
import { useAuth } from "../../App";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm]           = useState({ username: "", password: "" });
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!form.password)        return "Password is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    setError("");
    try {
      const { token, user } = await loginService(form);
      login(user, token);
      navigate(user.role === "Admin" ? "/admin/users" : "/tasks", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError("Invalid username or password.");
      } else {
        setError("Login failed. Please try again.");
      }
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
                className={submitted && !form.username.trim() ? "input-error" : ""}
                autoComplete="username"
                autoFocus
              />
            </div>
            {submitted && !form.username.trim() && (
              <p className="field-error">Username is required.</p>
            )}
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
                className={submitted && !form.password ? "input-error" : ""}
                autoComplete="current-password"
              />
            </div>
            {submitted && !form.password && (
              <p className="field-error">Password is required.</p>
            )}
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