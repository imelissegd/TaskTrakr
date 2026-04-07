import { useState, useEffect } from "react";
import { useAuth } from "../../App";
import { editAccount } from "../../services/authService";

export default function AccountDetailsPage() {
  const { user, login } = useAuth();
  const [editing, setEditing]     = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const [form, setForm] = useState({
    firstname:       user?.firstname  || "",
    middlename:      user?.middlename || "",
    lastname:        user?.lastname   || "",
    username:        user?.username   || "",
    email:           user?.email      || "",
    password:        "",
    confirmPassword: "",
  });
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const initials = [user?.firstname, user?.lastname]
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setForm({
      firstname:       user?.firstname  || "",
      middlename:      user?.middlename || "",
      lastname:        user?.lastname   || "",
      username:        user?.username   || "",
      email:           user?.email      || "",
      password:        "",
      confirmPassword: "",
    });
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
    if (!form.firstname.trim()) return "First name is required.";
    if (!form.lastname.trim())  return "Last name is required.";
    if (!form.email.trim())     return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email.";
    if (changingPw) {
      if (!form.password)              return "New password is required.";
      if (form.password.length < 8)    return "Password must be at least 8 characters.";
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
      const payload = {
        firstname:  form.firstname,
        middlename: form.middlename,
        lastname:   form.lastname,
        username:   form.username,
        email:      form.email,
      };
      if (changingPw && form.password) payload.password = form.password;
      const updated = await editAccount(payload);
      login(updated, localStorage.getItem("token"));
      setSuccess("Account updated successfully.");
      setSubmitted(false);
      setEditing(false);
      setChangingPw(false);
    } catch {
      setError("Failed to update account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="account-card">

        <div className="account-header">
          <div className="account-profile">
            <div className={`account-avatar ${isAdmin ? "account-avatar--admin" : "account-avatar--user"}`}>
              {initials}
            </div>
            <div>
              <h2 className="account-username">{user?.firstname} {user?.lastname}</h2>
              <span className={isAdmin ? "account-role-badge--admin" : "account-role-badge--user"}>
                {isAdmin ? "◈ Admin" : "◉ User"}
              </span>
            </div>
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="account-info-block mt-5">

            {/* First Name */}
            <div className="account-info-row">
              <span className="account-info-label">
                <span className="account-info-icon">&#128100;</span>
                First Name
              </span>
              {editing ? (
                <input
                  name="firstname"
                  type="text"
                  value={form.firstname}
                  onChange={handleChange}
                  className={`account-inline-input${submitted && !form.firstname ? " input-error" : ""}`}
                />
              ) : (
                <span className="account-info-value">{user?.firstname || "—"}</span>
              )}
            </div>
            {submitted && editing && !form.firstname && (
              <p className="field-error account-field-error">First name is required.</p>
            )}

            {/* Middle Name */}
            <div className="account-info-row">
              <span className="account-info-label">
                <span className="account-info-icon">&#128100;</span>
                Middle Name
              </span>
              {editing ? (
                <input
                  name="middlename"
                  type="text"
                  value={form.middlename}
                  onChange={handleChange}
                  className="account-inline-input"
                  placeholder="optional"
                />
              ) : (
                <span className="account-info-value">{user?.middlename || "—"}</span>
              )}
            </div>

            {/* Last Name */}
            <div className="account-info-row">
              <span className="account-info-label">
                <span className="account-info-icon">&#128100;</span>
                Last Name
              </span>
              {editing ? (
                <input
                  name="lastname"
                  type="text"
                  value={form.lastname}
                  onChange={handleChange}
                  className={`account-inline-input${submitted && !form.lastname ? " input-error" : ""}`}
                />
              ) : (
                <span className="account-info-value">{user?.lastname || "—"}</span>
              )}
            </div>
            {submitted && editing && !form.lastname && (
              <p className="field-error account-field-error">Last name is required.</p>
            )}

            {/* Username */}
            <div className="account-info-row">
              <span className="account-info-label">
                <span className="account-info-icon">&#64;</span>
                Username
              </span>
                <span className="account-info-value">{user?.username}</span>
            </div>

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

            {/* Password */}
            <div className="account-info-row">
              <span className="account-info-label">
                <span className="account-info-icon">&#128274;</span>
                Password
              </span>
              {editing ? (
                <button
                  type="button"
                  className={`account-change-pw-btn${changingPw ? " account-change-pw-btn--active" : ""}`}
                  onClick={() => {
                    setChangingPw(!changingPw);
                    setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
                  }}
                >
                  {changingPw ? "✕ Cancel" : "Change Password"}
                </button>
              ) : (
                <span className="account-info-value account-info-dots">••••••••</span>
              )}
            </div>

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
                      placeholder="Min. 8 chars"
                      className={submitted && !form.password ? "input-error" : ""}
                      autoComplete="new-password"
                    />
                  </div>
                  {submitted && !form.password && <p className="field-error">Password is required.</p>}
                  {submitted && form.password && form.password.length < 8 && (
                    <p className="field-error">Min. 8 characters.</p>
                  )}
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
                  {submitted && form.password !== form.confirmPassword && (
                    <p className="field-error">Passwords do not match.</p>
                  )}
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