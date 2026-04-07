import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  adminGetUserById,
  adminUpdateUser,
  adminUpdateUserRole,
  adminDeactivateUser,
  adminReactivateUser,
} from "../../services/adminService";

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate   = useNavigate();

  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [actioning, setActioning] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstname: "", middlename: "", lastname: "", email: "", role: "User",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminGetUserById(userId);
        setUser(data);
        seedForm(data);
      } catch {
        setError("User not found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const seedForm = (u) => {
    setForm({
      firstname:  u.firstname  || "",
      middlename: u.middlename || "",
      lastname:   u.lastname   || "",
      email:      u.email      || "",
      role:       u.role       || "User",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.firstname.trim()) return "First name is required.";
    if (!form.lastname.trim())  return "Last name is required.";
    if (!form.email.trim())     return "Email is required.";
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const err = validate();
    if (err) return setError(err);

    setSaving(true);
    setError("");
    try {
      // update details
      let updated = await adminUpdateUser(userId, {
        firstname:  form.firstname,
        middlename: form.middlename,
        lastname:   form.lastname,
        email:      form.email,
      });
      // update role if changed
      if (form.role !== user.role) {
        updated = await adminUpdateUserRole(userId, form.role);
      }
      setUser(updated);
      seedForm(updated);
      setSuccess("User updated successfully.");
      setSubmitted(false);
      setEditing(false);
    } catch {
      setError("Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    setActioning(true);
    setError("");
    try {
      await adminDeactivateUser(userId);
      const refreshed = await adminGetUserById(userId);
      setUser(refreshed);
      setSuccess("User deactivated.");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to deactivate user.";
          setError(message);
    } finally {
      setActioning(false);
    }
  };

  const handleReactivate = async () => {
    setActioning(true);
    setError("");
    try {
      await adminReactivateUser(userId);
      const refreshed = await adminGetUserById(userId);
      setUser(refreshed);
      setSuccess("User reactivated.");
    } catch {
      setError("Failed to reactivate user.");
    } finally {
      setActioning(false);
    }
  };

  if (loading) return <div className="auth-page"><p className="text-gray-400 text-sm">Loading user…</p></div>;

  if (error && !user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="alert-error">{error}</p>
          <button className="btn-secondary mt-4" onClick={() => navigate("/admin/users")}>← Back</button>
        </div>
      </div>
    );
  }

  const isAdmin   = user.role === "Admin";
  const initials  = [user.firstname, user.lastname].filter(Boolean).map((w) => w[0].toUpperCase()).join("") || "?";
  const fullName  = [user.firstname, user.middlename, user.lastname].filter(Boolean).join(" ");

  return (
    <div className="account-page">
      <div className="account-card admin-user-card">

        {/* Avatar + name */}
        <div className="account-profile">
          <div className={`account-avatar ${isAdmin ? "account-avatar--admin" : "account-avatar--user"}`}>
            {initials}
          </div>
          <div>
            <h2 className="account-username">{fullName}</h2>
            <span className={isAdmin ? "account-role-badge--admin" : "account-role-badge--user"}>
              {isAdmin ? "◈ Admin" : "◉ User"}
            </span>
          </div>
        </div>

        {/* Status pill */}
        <div className="admin-user-status-row">
          <span className={user.active ? "badge-active" : "badge-inactive"}>
            {user.active ? "● Active" : "○ Inactive"}
          </span>
        </div>

        {error && <div className="alert-error mt-3">{error}</div>}
        {success && <div className="alert-success mt-3">{success}</div>}

        <form onSubmit={handleSave} noValidate>
          <div className="account-info-block mt-5">

            {/* First name */}
            <div className="account-info-row">
              <span className="account-info-label"><span className="account-info-icon">👤</span> First Name</span>
              {editing
                ? <input name="firstname" value={form.firstname} onChange={handleChange}
                    className={`account-inline-input${submitted && !form.firstname ? " input-error" : ""}`} />
                : <span className="account-info-value">{user.firstname || "—"}</span>}
            </div>
            {submitted && editing && !form.firstname && <p className="field-error account-field-error">Required.</p>}

            {/* Middle name */}
            <div className="account-info-row">
              <span className="account-info-label"><span className="account-info-icon">👤</span> Middle Name</span>
              {editing
                ? <input name="middlename" value={form.middlename} onChange={handleChange}
                    className="account-inline-input" placeholder="optional" />
                : <span className="account-info-value">{user.middlename || "—"}</span>}
            </div>

            {/* Last name */}
            <div className="account-info-row">
              <span className="account-info-label"><span className="account-info-icon">👤</span> Last Name</span>
              {editing
                ? <input name="lastname" value={form.lastname} onChange={handleChange}
                    className={`account-inline-input${submitted && !form.lastname ? " input-error" : ""}`} />
                : <span className="account-info-value">{user.lastname || "—"}</span>}
            </div>
            {submitted && editing && !form.lastname && <p className="field-error account-field-error">Required.</p>}

            {/* Username — read-only always */}
            <div className="account-info-row">
              <span className="account-info-label"><span className="account-info-icon">@</span> Username</span>
              <span className="account-info-value font-mono">{user.username}</span>
            </div>

            {/* Email */}
            <div className="account-info-row">
              <span className="account-info-label"><span className="account-info-icon">✉</span> Email</span>
              {editing
                ? <input name="email" type="email" value={form.email} onChange={handleChange}
                    className={`account-inline-input${submitted && !form.email ? " input-error" : ""}`} />
                : <span className="account-info-value">{user.email || "—"}</span>}
            </div>
            {submitted && editing && !form.email && <p className="field-error account-field-error">Required.</p>}

            {/* Role */}
            <div className="account-info-row">
              <span className="account-info-label"><span className="account-info-icon">🛡</span> Role</span>
              {editing
                ? (
                  <select name="role" value={form.role} onChange={handleChange} className="account-role-select">
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                )
                : <span className="account-info-value">{user.role}</span>}
            </div>

          </div>

          {/* Edit / Save / Cancel */}
          {!editing && (
            <button type="button" className="btn-primary mt-2" onClick={() => { setEditing(true); setError(""); setSubmitted(false); }}>
              Edit User
            </button>
          )}
          {editing && (
            <div className="account-form-actions">
              <button type="button" className="btn-secondary account-cancel-btn"
                onClick={() => { setEditing(false); seedForm(user); setError(""); setSubmitted(false); }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary account-save-btn">
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}
        </form>

        {/* Deactivate / Reactivate */}
        {!editing && (
          <div className="admin-danger-zone">
            <p className="admin-danger-label">Account Status</p>
            {user.active
              ? (
                <button className="btn-danger admin-status-btn" disabled={actioning} onClick={handleDeactivate}>
                  {actioning ? "…" : "Deactivate Account"}
                </button>
              )
              : (
                <button className="admin-reactivate-btn" disabled={actioning} onClick={handleReactivate}>
                  {actioning ? "…" : "Reactivate Account"}
                </button>
              )
            }
          </div>
        )}

        <button className="admin-back-btn mt-4" onClick={() => navigate("/admin/users")}>
          ← Back to Users
        </button>

      </div>
    </div>
  );
}