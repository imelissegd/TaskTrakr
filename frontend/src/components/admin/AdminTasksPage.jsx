import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminGetAllTasks } from "../../services/adminService";

const STATUS_META = {
  Pending:   { label: "Pending",   css: "badge-tracking" },
  Completed: { label: "Completed", css: "badge-received" },
  Cancelled: { label: "Cancelled", css: "badge-cancelled" },
};

export default function AdminTasksPage() {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminGetAllTasks();
        setTasks(data);
      } catch {
        setError("Failed to load tasks.");
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
          <h1 className="page-header">All Tasks</h1>
          <p className="page-subheader">{tasks.length} task{tasks.length !== 1 ? "s" : ""} across all users</p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading && (
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
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Owner</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const meta = STATUS_META[t.status] ?? STATUS_META["Pending"];
                return (
                  <tr key={t.taskId}>
                    <td className="font-medium text-gray-800 text-sm">{t.title}</td>
                    <td className="text-sm text-gray-500 admin-td-desc">
                      {t.description || <span className="italic">—</span>}
                    </td>
                    <td><span className={meta.css}>{meta.label}</span></td>
                    <td className="font-mono text-sm text-gray-600">{t.username}</td>
                    <td>
                      <Link to={`/admin/tasks/${t.taskId}`} className="admin-view-btn">
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}