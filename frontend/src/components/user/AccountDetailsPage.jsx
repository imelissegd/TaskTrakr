import { useState, useEffect } from "react";
import { useAuth } from "../../App";
import { editAccount } from "../../services/authService";

export default function AccountDetailsPage() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);
  const initials = (user?.username || "?")
    .split(/[\s_-]/)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setForm({ username: user?.username || "", email: user?.email || "", password: "", confirmPassword: "" });
    setError("");
    setSuccess("");
    setSubmitted(false);
    setChangingPw(false);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setChangingPw(false);
    setError("");
    setSubmitted(false);
  };

  const validate = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email.";
    if (changingPw) {
      if (!form.password) return "New password is required.";
      if (form.password.length < 6) return "Password must be at least 6 characters.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
    }
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
      const payload = { username: form.username, email: form.email };
      if (changingPw && form.password) payload.password = form.password;
      const updated = await editAccount(payload);
      login(updated, localStorage.getItem("token"));
      setSuccess("Account updated successfully.");
      setSubmitted(false);
      setEditing(false);
      setChangingPw(false);
    } catch (err) {
      setError("Failed to update account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="account-card">

        {/* ── Header row: avatar + edit button ── */}
        <div className="account-header">
          <div className="account-profile">
            <div className={`account-avatar ${isAdmin ? "account-avatar--admin" : "account-avatar--user"}`}>
              {initials}
            </div>
            <div>
              <h2 className="account-username">{user?.username}</h2>
              <span className={isAdmin ? "account-role-badge--admin" : "account-role-badge--user"}>
                {isAdmin ? "◈ Admin" : "◉ User"}
              </span>
            </div>
          </div>

        </div>

        {/* Error alert */}
        {error && <div className="alert-error">{error}</div>}

        {/* ── Info rows / editable fields ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="account-info-block mt-5">

            {/* Username */}
            <div className="account-info-row">
              <span className="account-info-label">
                <span className="account-info-icon">&#128100;</span>
                Username
              </span>
              {editing ? (
                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  className={`account-inline-input${submitted && !form.username ? " input-error" : ""}`}
                  autoComplete="username"
                />
              ) : (
                <span className="account-info-value">{user?.username}</span>
              )}
            </div>
            {submitted && editing && !form.username && (
              <p className="field-error account-field-error">Username is required.</p>
            )}

            {/* Email */}
            <div className="account-info-row">
              <span className="account-info-label">
                <span className="account-info-icon">&#9993;</span>
                Email
              </span>
              {editing ? (
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`account-inline-input${submitted && !form.email ? " input-error" : ""}`}
                  autoComplete="email"
                />
              ) : (
                <span className="account-info-value">{user?.email || "—"}</span>
              )}
            </div>
            {submitted && editing && !form.email && (
              <p className="field-error account-field-error">Email is required.</p>
            )}

            {/* Password row */}
            <div className="account-info-row">
              <span className="account-info-label">
                <span className="account-info-icon">&#128274;</span>
                Password
              </span>
              {editing ? (
                <button
                  type="button"
                  className={`account-change-pw-btn${changingPw ? " account-change-pw-btn--active" : ""}`}
                  onClick={() => { setChangingPw(!changingPw); setForm((f) => ({ ...f, password: "", confirmPassword: "" })); }}
                >
                  {changingPw ? "✕ Cancel" : "Change Password"}
                </button>
              ) : (
                <span className="account-info-value account-info-dots">••••••••</span>
              )}
            </div>

            {/* Expanded password fields */}
            {editing && changingPw && (
              <div className="account-pw-fields">
                <div className="field-group">
                  <label htmlFor="password">New Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">&#128274;</span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 6 chars"
                      className={submitted && !form.password ? "input-error" : ""}
                      autoComplete="new-password"
                    />
                  </div>
                  {submitted && !form.password && <p className="field-error">Password is required.</p>}
                  {submitted && form.password && form.password.length < 6 && <p className="field-error">Min. 6 characters.</p>}
                </div>
                <div className="field-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">&#128274;</span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      className={submitted && form.password !== form.confirmPassword ? "input-error" : ""}
                      autoComplete="new-password"
                    />
                  </div>
                  {submitted && form.password !== form.confirmPassword && <p className="field-error">Passwords do not match.</p>}
                </div>
              </div>
            )}

            {/* Role — always read-only */}
            <div className="account-info-row">
              <span className="account-info-label">
                <span className="account-info-icon">&#128736;</span>
                Role
              </span>
              <span className="account-info-value">{user?.role}</span>
            </div>

          </div>

          {/* Edit / Save / Cancel */}
          {!editing && (
            <button type="button" className="btn-primary" onClick={handleEdit}>
              Edit Info
            </button>
          )}
          {!editing && success && <div className="alert-success mt-3">{success}</div>}
          {editing && (
            <div className="account-form-actions">
              <button type="button" className="btn-secondary account-cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary account-save-btn">
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}