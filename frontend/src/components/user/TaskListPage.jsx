import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTasks, deleteTask, updateTask } from "../../services/taskService";

const STATUS_META = {
  Pending:   { label: "Pending",   css: "badge-tracking" },
  Completed: { label: "Completed", css: "badge-received" },
  Cancelled: { label: "Cancelled", css: "badge-cancelled" },
};

const IconView    = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 3C5 3 1.73 7.11 1.07 9.75a.75.75 0 000 .5C1.73 12.89 5 17 10 17s8.27-4.11 8.93-6.75a.75.75 0 000-.5C18.27 7.11 15 3 10 3zm0 11a4 4 0 110-8 4 4 0 010 8zm0-6a2 2 0 100 4 2 2 0 000-4z"/></svg>;
const IconEdit    = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>;
const IconCheck   = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>;
const IconPending = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>;
const IconCancel  = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524L13.477 14.89zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/></svg>;
const IconRestore = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>;
const IconDelete  = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>;

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

  const handleStatusChange = async (task, newStatus) => {
    setActionId(task.taskId);
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
            const meta        = STATUS_META[task.status] ?? STATUS_META["Pending"];
            const busy        = actionId === task.taskId;
            const isCompleted = task.status === "Completed";
            const isCancelled = task.status === "Cancelled";

            return (
              <div
                key={task.taskId}
                className={`task-card${isCancelled ? " task-card--cancelled" : ""}`}
              >
                {/* Single row: content left, actions right */}
                <div className="flex items-center gap-4">

                  {/* Left: badge + title + desc */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={meta.css}>{meta.label}</span>
                    </div>
                    <h3 className="task-card-title">{task.title}</h3>
                    {task.description && (
                      <p className="task-card-desc mt-0.5">{task.description}</p>
                    )}
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-1.5 shrink-0">

                    {!isCancelled && (
                      <Link
                        to={`/tasks/${task.taskId}`}
                        className="task-action-btn task-action-btn--view"
                      >
                        <IconView /> View
                      </Link>
                    )}

                    {!isCancelled && (
                      <Link
                        to={`/tasks/edit/${task.taskId}`}
                        className="task-action-btn task-action-btn--edit"
                      >
                        <IconEdit /> Edit
                      </Link>
                    )}

                    {!isCancelled && (
                      <button
                        className="task-action-btn task-action-btn--complete"
                        disabled={busy}
                        onClick={() => handleStatusChange(task, isCompleted ? "Pending" : "Completed")}
                      >
                        {isCompleted
                          ? <><IconPending /> Mark Pending</>
                          : <><IconCheck /> Mark Complete</>}
                      </button>
                    )}

                    {!isCompleted && (
                      <button
                        className="task-action-btn task-action-btn--cancel"
                        disabled={busy}
                        onClick={() => handleStatusChange(task, isCancelled ? "Pending" : "Cancelled")}
                      >
                        {isCancelled
                          ? <><IconRestore /> Restore</>
                          : <><IconCancel /> Cancel</>}
                      </button>
                    )}

                    <button
                      className="task-action-btn task-action-btn--delete"
                      disabled={busy}
                      onClick={() => setToDelete(task)}
                    >
                      <IconDelete /> Delete
                    </button>

                  </div>

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