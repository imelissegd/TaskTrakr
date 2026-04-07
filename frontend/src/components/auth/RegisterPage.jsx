import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("User");
  const [form, setForm] = useState({
    firstname:  "",
    middlename: "",
    lastname:   "",
    username:   "",
    email:      "",
    password:   "",
    confirmPassword: "",
  });
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.firstname.trim())  return "First name is required.";
    if (!form.lastname.trim())   return "Last name is required.";
    if (!form.username.trim())   return "Username is required.";
    if (!form.email.trim())      return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email.";
    if (!form.password)          return "Password is required.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
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
      const payload = {
        firstname:  form.firstname,
        middlename: form.middlename || undefined,
        lastname:   form.lastname,
        username:   form.username,
        email:      form.email,
        password:   form.password,
        role,
      };
      await register(payload);
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || "Registration failed. Please try again.");
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

        <div className="auth-divider" />
        <h1 className="auth-heading">Create Account</h1>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>

          {/* Role toggle */}
          <div className="field-group">
            <label>Account type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("User")}
                className={role === "User" ? "role-btn-user-active" : "role-btn"}
              >
                <span className="block text-base mb-0.5">◉</span>
                User
              </button>
              <button
                type="button"
                onClick={() => setRole("Admin")}
                className={role === "Admin" ? "role-btn-admin-active" : "role-btn"}
              >
                <span className="block text-base mb-0.5">◈</span>
                Admin
              </button>
            </div>
            <p className="role-hint">
              {role === "User"
                ? "Users can create and manage their own tasks."
                : "Admins can view all users and tasks."}
            </p>
          </div>

          {/* First + Last name row */}
          <div className="field-row">
            <div className="field-group">
              <label htmlFor="firstname">First Name</label>
              <div className="input-wrap">
                <span className="input-icon">&#128100;</span>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={form.firstname}
                  onChange={handleChange}
                  placeholder="Jane"
                  className={fieldInvalid("firstname") ? "input-error" : ""}
                  autoComplete="given-name"
                />
              </div>
              {submitted && !form.firstname.trim() && (
                <p className="field-error">Required.</p>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="lastname">Last Name</label>
              <div className="input-wrap">
                <span className="input-icon">&#128100;</span>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={form.lastname}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={fieldInvalid("lastname") ? "input-error" : ""}
                  autoComplete="family-name"
                />
              </div>
              {submitted && !form.lastname.trim() && (
                <p className="field-error">Required.</p>
              )}
            </div>
          </div>

          {/* Middle name */}
          <div className="field-group">
            <label htmlFor="middlename">
              Middle Name <span className="field-optional">(optional)</span>
            </label>
            <div className="input-wrap">
              <span className="input-icon">&#128100;</span>
              <input
                id="middlename"
                name="middlename"
                type="text"
                value={form.middlename}
                onChange={handleChange}
                placeholder="e.g. Marie"
                autoComplete="additional-name"
              />
            </div>
          </div>

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
            {submitted && !form.username.trim() && (
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
            {submitted && !form.email.trim() && (
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
                  placeholder="Min. 8 chars"
                  className={fieldInvalid("password") ? "input-error" : ""}
                  autoComplete="new-password"
                />
              </div>
              {submitted && !form.password && (
                <p className="field-error">Password is required.</p>
              )}
              {submitted && form.password && form.password.length < 8 && (
                <p className="field-error">Min. 8 characters.</p>
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