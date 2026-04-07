import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTaskById } from "../../services/taskService";

const STATUS_META = {
  Pending:   { label: "Pending",   css: "badge-tracking" },
  Completed: { label: "Completed", css: "badge-received" },
  Cancelled: { label: "Cancelled", css: "badge-cancelled" },
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTaskById(id);
        setTask(data);
      } catch {
        setError("Task not found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="auth-page">
        <p className="text-gray-400 text-sm">Loading task…</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="alert-error">{error || "Task not found."}</p>
          <button className="btn-secondary mt-4" onClick={() => navigate("/tasks")}>
            ← Back to Tasks
          </button>
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
          <p className="page-subheader" style={{ marginBottom: 0 }}>Viewing task #{task.taskId}</p>
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

          <div className="task-detail-row task-detail-row--col">
            <span className="task-detail-label">Description</span>
            <span className="task-detail-desc">
              {task.description || <span className="text-gray-400 italic">No description provided.</span>}
            </span>
          </div>

        </div>

        <div className="addtask-actions mt-6">
          <Link to="/tasks" className="btn-secondary addtask-cancel">
            ← Back
          </Link>
          <Link to={`/tasks/edit/${task.taskId}`} className="btn-primary addtask-submit text-center no-underline">
            Edit Task
          </Link>
        </div>

      </div>
    </div>
  );
}