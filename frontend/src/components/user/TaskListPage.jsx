import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTasks, deleteTask, updateTask } from "../../services/taskService";

const STATUS_META = {
  Pending:   { label: "Pending",   css: "badge-tracking" },
  Completed: { label: "Completed", css: "badge-received" },
  Cancelled: { label: "Cancelled", css: "badge-cancelled" },
};

function ConfirmModal({ task, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box animate-slide-up">
        <h3 className="modal-title">Delete Task?</h3>
        <p className="modal-body">
          <span className="font-semibold">"{task.title}"</span> will be permanently removed.
        </p>
        <div className="modal-actions">
          <button className="btn-secondary modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-danger modal-confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function TaskListPage() {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [actionId, setActionId] = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    setActionId(task.taskId);
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      const updated = await updateTask(task.taskId, { ...task, status: newStatus });
      setTasks((prev) => prev.map((t) => (t.taskId === task.taskId ? updated : t)));
    } catch {
      setError("Failed to update task.");
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    const task = toDelete;
    setToDelete(null);
    setActionId(task.taskId);
    try {
      await deleteTask(task.taskId);
      setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    } catch {
      setError("Failed to delete task.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="tasks-page">

      <div className="tasks-header">
        <div>
          <h1 className="page-header">My Tasks</h1>
          <p className="page-subheader">{tasks.length} task{tasks.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link to="/tasks/add" className="btn-primary tasks-add-btn">
          + Add Task
        </Link>
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
          <p className="tasks-empty-text">No tasks yet.</p>
          <p className="tasks-empty-sub">Click <strong>+ Add Task</strong> to get started.</p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="tasks-grid">
          {tasks.map((task) => {
            const meta = STATUS_META[task.status] ?? STATUS_META["Pending"];
            const busy = actionId === task.taskId;
            const isDone = task.status === "Completed";
            const isCancelled = task.status === "Cancelled";
            return (
              <div
                key={task.taskId}
                className={`task-card${isCancelled ? " task-card--cancelled" : ""}`}
              >
                <div className="task-card-top">
                  <h3 className={`task-card-title${isDone ? " task-card-title--done" : ""}`}>
                    {task.title}
                  </h3>
                  <div className="task-card-badges">
                    <span className={meta.css}>{meta.label}</span>
                  </div>
                </div>

                {task.description && (
                  <p className="task-card-desc">{task.description}</p>
                )}

                <div className="task-card-actions">
                  <Link to={`/tasks/edit/${task.taskId}`} className="task-btn-edit">
                    Edit
                  </Link>
                  <button
                    className={isDone ? "task-btn-undo" : "task-btn-complete"}
                    disabled={busy || isCancelled}
                    onClick={() => handleToggleComplete(task)}
                  >
                    {busy ? "…" : isDone ? "Mark Pending" : "Mark Complete"}
                  </button>
                  <button
                    className="task-btn-delete"
                    disabled={busy}
                    onClick={() => setToDelete(task)}
                  >
                    {busy ? "…" : "Delete"}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {toDelete && (
        <ConfirmModal
          task={toDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setToDelete(null)}
        />
      )}

    </div>
  );
}