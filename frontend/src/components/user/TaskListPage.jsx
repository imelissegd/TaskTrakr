import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTasks, deleteTask, updateTask } from "../../services/taskService";

const STATUS_META = {
  tracking:  { label: "Tracking",  css: "badge-tracking" },
  received:  { label: "Received",  css: "badge-received" },
  cancelled: { label: "Cancelled", css: "badge-cancelled" },
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
    setActionId(task.id);
    try {
      const updated = await updateTask(task.id, { ...task, completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch {
      setError("Failed to update task.");
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    const task = toDelete;
    setToDelete(null);
    setActionId(task.id);
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
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
            const meta = STATUS_META[task.status] ?? STATUS_META["tracking"];
            const busy = actionId === task.id;
            return (
              <div key={task.id} className={`task-card${task.completed ? " task-card--completed" : ""}`}>

                <div className="task-card-top">
                  <h3 className={`task-card-title${task.completed ? " task-card-title--done" : ""}`}>
                    {task.title}
                  </h3>
                  <div className="task-card-badges">
                    <span className={meta.css}>{meta.label}</span>
                    {task.completed && <span className="badge-completed">✓ Done</span>}
                  </div>
                </div>

                {task.description && (
                  <p className="task-card-desc">{task.description}</p>
                )}

                <div className="task-card-actions">
                  <Link to={`/tasks/edit/${task.id}`} className="task-btn-edit">
                    Edit
                  </Link>
                  <button
                    className={task.completed ? "task-btn-undo" : "task-btn-complete"}
                    disabled={busy}
                    onClick={() => handleToggleComplete(task)}
                  >
                    {busy ? "…" : task.completed ? "Mark Pending" : "Mark Complete"}
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