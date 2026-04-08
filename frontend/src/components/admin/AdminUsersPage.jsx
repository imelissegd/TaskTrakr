import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  adminGetAllUsers,
  adminUpdateUserRole,
  adminDeactivateUser,
  adminReactivateUser,
} from "../../services/adminService";

const IconView       = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 3C5 3 1.73 7.11 1.07 9.75a.75.75 0 000 .5C1.73 12.89 5 17 10 17s8.27-4.11 8.93-6.75a.75.75 0 000-.5C18.27 7.11 15 3 10 3zm0 11a4 4 0 110-8 4 4 0 010 8zm0-6a2 2 0 100 4 2 2 0 000-4z"/></svg>;
const IconEdit       = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>;
const IconPromote    = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707a1 1 0 00-1.414-1.414L10 10.172 7.707 7.879a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3z" clipRule="evenodd"/></svg>;
const IconDemote     = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.293a1 1 0 00-1.414 0L10 9.586 7.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" clipRule="evenodd"/></svg>;
const IconDeactivate = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524L13.477 14.89zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/></svg>;
const IconReactivate = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>;

export default function AdminUsersPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [actionId, setActionId] = useState(null);

  const [page, setPage] = useState(0);
  const [pageSize] = useState(10); // or 10, whatever default
  const [totalPages, setTotalPages] = useState(0);

  const [searchName, setSearchName] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterActive, setFilterActive] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await adminGetAllUsers({
        page,
        size: pageSize,
        name: searchName || undefined,
        role: filterRole || undefined,
        active: filterActive === "" ? undefined : filterActive === "true",
      });

      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch {
      setError("Failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchName, filterRole, filterActive]);

useEffect(() => {
  setPage(0); // reset to first page whenever search/filter changes
}, [searchName, filterRole, filterActive]);

  const handlePromoteDemote = async (u) => {
    setActionId(u.userId);
    const newRole = u.role === "Admin" ? "User" : "Admin";
    try {
      const updated = await adminUpdateUserRole(u.userId, newRole);
      setUsers((prev) => prev.map((x) => (x.userId === u.userId ? updated : x)));
    } catch {
      setError("Failed to update role.");
    } finally {
      setActionId(null);
    }
  };

  const handleToggleActive = async (u) => {
    setActionId(u.userId);
    try {
      if (u.active) {
        await adminDeactivateUser(u.userId);
      } else {
        await adminReactivateUser(u.userId);
      }
      setUsers((prev) =>
        prev.map((x) => (x.userId === u.userId ? { ...x, active: !x.active } : x))
      );
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update account status.";
          setError(message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="admin-page">

      <div className="tasks-header">
        <div>
          <h1 className="page-header">All Users</h1>
          <p className="page-subheader">{users.length} registered account{users.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {/* Name Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="task-action-btn !px-3 !py-1 !text-sm !bg-white !border !border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Role Filter */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="task-action-btn !px-3 !py-1 !text-sm !bg-white !border !border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>

        {/* Active Status Filter */}
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="task-action-btn !px-3 !py-1 !text-sm !bg-white !border !border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button
            className="task-action-btn task-action-btn--cancel"
            onClick={() => {
              setSearchName("");
              setFilterRole("");
              setFilterActive("");
              setPage(0);
            }}
          >
            Clear Filters
          </button>
      </div>
      {error && <div className="alert-error">{error}</div>}

      {/* Show no users found only if users is empty and not loading */}
      {!loading && users.length === 0 && (
        <div className="tasks-empty">
          <span className="tasks-empty-icon">👥</span>
          <p className="tasks-empty-text">No users found.</p>
        </div>
      )}

      {users.length > 0 && (
        <div className="tasks-grid">
          {users.map((u) => {
            const busy      = actionId === u.userId;
            const isAdmin   = u.role === "Admin";
            const fullName  = [u.firstname, u.middlename, u.lastname].filter(Boolean).join(" ");
            const initials  = [u.firstname, u.lastname].filter(Boolean).map((w) => w[0].toUpperCase()).join("") || "?";

            return (
              <div key={u.userId} className={`task-card${!u.active ? " task-card--cancelled" : ""}`}>

                {/* Single row: avatar + info left, actions right */}
                <div className="flex items-center gap-4">

                  {/* Avatar */}
                  <div className={`account-avatar shrink-0 !w-10 !h-10 !text-sm !mb-0 ${isAdmin ? "account-avatar--admin" : "account-avatar--user"}`}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={isAdmin ? "badge-admin-role" : "badge-user-role"}>
                        {isAdmin ? "◈ Admin" : "◉ User"}
                      </span>
                      <span className={u.active ? "badge-active" : "badge-inactive"}>
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="task-card-title">{fullName}</p>
                    <p className="task-card-desc mt-0.5">{u.username} · {u.email || "—"}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">

                    <Link
                      to={`/admin/users/${u.userId}`}
                      className="task-action-btn task-action-btn--view"
                    >
                      <IconView /> View
                    </Link>

                    <Link
                      to={`/admin/users/${u.userId}`}
                      className="task-action-btn task-action-btn--edit"
                    >
                      <IconEdit /> Edit
                    </Link>

                    <button
                      className={`task-action-btn ${isAdmin ? "task-action-btn--demote" : "task-action-btn--promote"}`}
                      disabled={busy}
                      onClick={() => handlePromoteDemote(u)}
                    >
                      {isAdmin ? <><IconDemote /> Demote</> : <><IconPromote /> Promote</>}
                    </button>

                    <button
                      className={`task-action-btn ${u.active ? "task-action-btn--cancel" : "task-action-btn--complete"}`}
                      disabled={busy}
                      onClick={() => handleToggleActive(u)}
                    >
                      {busy
                        ? "…"
                        : u.active
                          ? <><IconDeactivate /> Deactivate</>
                          : <><IconReactivate /> Reactivate</>}
                    </button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

{!loading && totalPages > 1 && (
  <div className="flex items-center gap-2 mt-4 justify-center">

    <button
      className="task-action-btn"
      disabled={page === 0}
      onClick={() => setPage((p) => Math.max(p - 1, 0))}
    >
      Previous
    </button>

    {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
      <button
        key={i}
        className={`task-action-btn ${i === page ? "bg-blue-500 text-white" : ""}`}
        onClick={() => setPage(i)}
      >
        {i + 1}
      </button>
    ))}

    <button
      className="task-action-btn"
      disabled={page >= totalPages - 1}
      onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
    >
      Next
    </button>

  </div>
)}
    </div>
  );
}