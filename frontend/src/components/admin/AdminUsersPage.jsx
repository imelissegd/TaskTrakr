import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminGetAllUsers } from "../../services/adminService";

export default function AdminUsersPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminGetAllUsers();
        setUsers(data);
      } catch {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="admin-page">

      <div className="tasks-header">
        <div>
          <h1 className="page-header">All Users</h1>
          <p className="page-subheader">{users.length} registered account{users.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading && (
        <div className="tasks-empty">
          <span className="tasks-empty-icon">⏳</span>
          <p>Loading users…</p>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="tasks-empty">
          <span className="tasks-empty-icon">👥</span>
          <p className="tasks-empty-text">No users found.</p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td className="admin-td-name">
                    {[u.firstname, u.middlename, u.lastname].filter(Boolean).join(" ")}
                  </td>
                  <td className="font-mono text-sm text-gray-600">{u.username}</td>
                  <td className="text-sm text-gray-600">{u.email || "—"}</td>
                  <td>
                    <span className={u.role === "Admin" ? "badge-admin-role" : "badge-user-role"}>
                      {u.role === "Admin" ? "◈ Admin" : "◉ User"}
                    </span>
                  </td>
                  <td>
                    <span className={u.active ? "badge-active" : "badge-inactive"}>
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/users/${u.userId}`} className="admin-view-btn">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}