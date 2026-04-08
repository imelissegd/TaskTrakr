import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminGetAllTasks, adminGetAllUsers } from "../../services/adminService";

const STATUS_META = {
  Pending:   { label: "Pending",   css: "badge-tracking" },
  Completed: { label: "Completed", css: "badge-received" },
  Cancelled: { label: "Cancelled", css: "badge-cancelled" },
};

const IconView = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 3C5 3 1.73 7.11 1.07 9.75a.75.75 0 000 .5C1.73 12.89 5 17 10 17s8.27-4.11 8.93-6.75a.75.75 0 000-.5C18.27 7.11 15 3 10 3zm0 11a4 4 0 110-8 4 4 0 010 8zm0-6a2 2 0 100 4 2 2 0 000-4z"/></svg>;

export default function AdminTasksPage() {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0); // Total task from backend

  const [searchTitle, setSearchTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUserId, setFilterUserId] = useState(null);
  const [users, setUsers] = useState([]);

    const fetchTasks = async () => {
      try {
        const data = await adminGetAllTasks({
          page,
          size: pageSize,
          title: searchTitle || undefined,
          status: filterStatus || undefined,
          userId: filterUserId || undefined,
        });

        setTasks(data.content);        // assume backend returns { content, totalPages }
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch {
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      setPage(0); // reset to first page whenever filters/search change
    }, [searchTitle, filterStatus, filterUserId]);

    useEffect(() => {
      fetchTasks();
    }, [page, searchTitle, filterStatus, filterUserId]);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const data = await adminGetAllUsers({ active: true, size: 100 }); // fetch active users
          setUsers(data.content);
        } catch (err) {
          console.error("Failed to load users", err);
        }
      };
      fetchUsers();
    }, []);

  return (
    <div className="tasks-page">

      <div className="tasks-header">
        <div>
          <h1 className="page-header">All Tasks</h1>
          <p className="page-subheader">
            {totalElements} task{totalElements !== 1 ? "s" : ""} across all users
          </p>
        </div>
      </div>

    <div className="flex items-center gap-2 mb-4">

      {/* Title Search */}
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        className="task-action-btn !px-3 !py-1 !text-sm !bg-white !border !border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

    {/* Owner Filter */}
      <select
        value={filterUserId ?? ""}
        onChange={(e) => setFilterUserId(e.target.value ? Number(e.target.value) : null)}
        className="task-action-btn !px-3 !py-1 !text-sm !bg-white !border !border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Users</option>
        {users.map((user) => (
          <option key={user.userId} value={user.userId}>
            {user.firstname} {user.middlename} {user.lastname}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="task-action-btn !px-3 !py-1 !text-sm !bg-white !border !border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <button
        className="task-action-btn task-action-btn--cancel"
        onClick={() => {
          setSearchTitle("");
          setFilterStatus("");
          setFilterUserId(null);
          setPage(0);
        }}
      >
        Clear Filters
      </button>
    </div>

      {error && <div className="alert-error">{error}</div>}

    {loading && (
      <div className="tasks-empty">
        <span className="tasks-empty-icon">⏳</span>
        <p>Loading tasks…</p>
      </div>
    )}

    {loading && tasks.length === 0 && (
      <div className="tasks-empty">
        <span className="tasks-empty-icon">⏳</span>
        <p>Loading tasks…</p>
      </div>
    )}

    {!loading && tasks.length === 0 && (
      <div className="tasks-empty">
        <span className="tasks-empty-icon">📋</span>
        <p className="tasks-empty-text">No tasks found.</p>
      </div>
    )}

      {!loading && tasks.length > 0 && (
        <div className="tasks-grid">

          {/* Column header */}
          <div className="task-card" style={{ background: "var(--surface-100, #f4f4f5)" }}>
            <div className="flex items-center gap-4">
              <span className="admin-col-header" style={{ flex: "2 1 0" }}>Task</span>
              <span className="admin-col-header" style={{ flex: "3 1 0" }}>Description</span>
              <span className="admin-col-header" style={{ width: "90px", flexShrink: 0 }}>Status</span>
              <span className="admin-col-header" style={{ width: "100px", flexShrink: 0 }}>Owner</span>
              <span className="admin-col-header" style={{ width: "60px", flexShrink: 0 }}>Action </span>
            </div>
          </div>

          {tasks.map((task) => {
            const meta        = STATUS_META[task.status] ?? STATUS_META["Pending"];
            const isCancelled = task.status === "Cancelled";

            return (
              <div
                key={task.taskId}
                className={`task-card${isCancelled ? " task-card--cancelled" : ""}`}
              >
                <div className="flex items-center gap-4">

                  {/* Task title */}
                  <div style={{ flex: "2 1 0" }} className="min-w-0">
                    <h3 className="task-card-title truncate">{task.title}</h3>
                  </div>

                  {/* Description */}
                  <div style={{ flex: "3 1 0" }} className="min-w-0">
                    <p className="task-card-desc truncate">
                      {task.description || <span className="italic text-gray-300">—</span>}
                    </p>
                  </div>

                  {/* Status */}
                  <div style={{ width: "90px", flexShrink: 0 }}>
                    <span className={meta.css}>{meta.label}</span>
                  </div>

                  {/* Owner */}
                  <div style={{ width: "100px", flexShrink: 0 }}>
                    <span className="text-xs font-mono text-gray-600 truncate block">{task.username}</span>
                  </div>

                  {/* Action */}
                  <div style={{ width: "60px", flexShrink: 0 }} className="flex justify-end">
                    <Link
                      to={`/admin/tasks/${task.taskId}`}
                      className="task-action-btn task-action-btn--view"
                    >
                      <IconView /> View
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4 justify-center">
          {/* Previous button */}
          <button
            className="task-action-btn"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            Previous
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
            <button
              key={i}
              className={`task-action-btn ${i === page ? "bg-blue-500 text-white" : ""}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}

          {/* Next button */}
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