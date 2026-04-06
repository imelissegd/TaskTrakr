import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.username.trim())  return "Username is required.";
    if (!form.email.trim())     return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email.";
    if (!form.password)         return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError("");
    try {
      await register(form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldInvalid = (field) => submitted && !form[field];

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">

        {/* Brand block */}
        <div className="auth-brand">
          <div className="auth-logo">
            <span className="auth-logo-green">Task</span>
            <span className="auth-logo-blue">Trakr</span>
          </div>
          <span className="auth-tagline">Task Management System</span>
        </div>

        {/* Green → blue gradient divider */}
        <div className="auth-divider" />

        <h1 className="auth-heading">Create Account</h1>

        {error   && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>

          {/* Username */}
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
                className={fieldInvalid("username") ? "input-error" : ""}
                autoComplete="username"
              />
            </div>
            {submitted && !form.username && (
              <p className="field-error">Username is required.</p>
            )}
          </div>

          {/* Email */}
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <span className="input-icon">&#9993;</span>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={fieldInvalid("email") ? "input-error" : ""}
                autoComplete="email"
              />
            </div>
            {submitted && !form.email && (
              <p className="field-error">Email is required.</p>
            )}
          </div>

          {/* Password + Confirm side by side */}
          <div className="field-row">
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
                  placeholder="Min. 6 chars"
                  className={fieldInvalid("password") ? "input-error" : ""}
                  autoComplete="new-password"
                />
              </div>
              {submitted && !form.password && (
                <p className="field-error">Password is required.</p>
              )}
              {submitted && form.password && form.password.length < 6 && (
                <p className="field-error">Min. 6 characters.</p>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="confirmPassword">Confirm</label>
              <div className="input-wrap">
                <span className="input-icon">&#128274;</span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className={
                    submitted && form.password !== form.confirmPassword
                      ? "input-error" : ""
                  }
                  autoComplete="new-password"
                />
              </div>
              {submitted && form.password !== form.confirmPassword && (
                <p className="field-error">Passwords do not match.</p>
              )}
            </div>
          </div>

          {/* Role toggle */}
          <div className="field-group">
            <label>Account type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "USER" })}
                className={form.role === "USER" ? "role-btn-user-active" : "role-btn"}
              >
                <span className="block text-base mb-0.5">◉</span>
                User
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "ADMIN" })}
                className={form.role === "ADMIN" ? "role-btn-admin-active" : "role-btn"}
              >
                <span className="block text-base mb-0.5">◈</span>
                Admin
              </button>
            </div>
            <p className="role-hint">
              {form.role === "USER"
                ? "Users can create and manage their own tasks."
                : "Admins can view all users and tasks."}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}