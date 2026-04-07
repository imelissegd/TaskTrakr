import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminGetTaskById } from "../../services/adminService";

const STATUS_META = {
  Pending:   { label: "Pending",   css: "badge-tracking" },
  Completed: { label: "Completed", css: "badge-received" },
  Cancelled: { label: "Cancelled", css: "badge-cancelled" },
};

export default function AdminTaskDetailPage() {
  const { taskId } = useParams();
  const navigate   = useNavigate();

  const [task, setTask]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminGetTaskById(taskId);
        setTask(data);
      } catch {
        setError("Task not found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [taskId]);

  if (loading) return <div className="auth-page"><p className="text-gray-400 text-sm">Loading task…</p></div>;

  if (error || !task) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="alert-error">{error || "Task not found."}</p>
          <button className="btn-secondary mt-4" onClick={() => navigate("/admin/tasks")}>← Back</button>
        </div>
      </div>
    );
  }

  const meta = STATUS_META[task.status] ?? STATUS_META["Pending"];

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">

        <div className="auth-brand">
          <h1 className="page-header" style={{ marginBottom: 0 }}>Task Detail</h1>
          <p className="page-subheader" style={{ marginBottom: 0 }}>Admin view — Task #{task.taskId}</p>
        </div>
        <div className="auth-divider" />

        <div className="task-detail-block">

          <div className="task-detail-row">
            <span className="task-detail-label">Title</span>
            <span className="task-detail-value">{task.title}</span>
          </div>

          <div className="task-detail-row">
            <span className="task-detail-label">Status</span>
            <span className={meta.css}>{meta.label}</span>
          </div>

          <div className="task-detail-row">
            <span className="task-detail-label">Owner</span>
            <span className="task-detail-value font-mono">{task.username}</span>
          </div>

          <div className="task-detail-row task-detail-row--col">
            <span className="task-detail-label">Description</span>
            <span className="task-detail-desc">
              {task.description || <span className="text-gray-400 italic">No description provided.</span>}
            </span>
          </div>

        </div>

        <div className="addtask-actions mt-6">
          <button className="btn-secondary addtask-cancel" onClick={() => navigate("/admin/tasks")}>
            ← Back
          </button>
        </div>

      </div>
    </div>
  );
}