import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTask } from "../../services/taskService";

const STATUSES = [
  { value: "tracking",  label: "Tracking" },
  { value: "received",  label: "Received" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AddTaskPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "", status: "tracking", completed: false });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    setError("");
  };

  const validate = () => {
    if (!form.title.trim()) return "Task title is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    try {
      await createTask(form);
      navigate("/tasks");
    } catch {
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">

        {/* Heading */}
        <div className="auth-brand">
          <h1 className="page-header" style={{ marginBottom: 0 }}>Add Task</h1>
          <p className="page-subheader" style={{ marginBottom: 0 }}>Fill in the details below</p>
        </div>

        <div className="auth-divider" />

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>

          {/* Title */}
          <div className="field-group">
            <label htmlFor="title">Title</label>
            <div className="input-wrap">
              <span className="input-icon">&#128196;</span>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Buy groceries"
                className={submitted && !form.title.trim() ? "input-error" : ""}
                autoComplete="off"
              />
            </div>
            {submitted && !form.title.trim() && (
              <p className="field-error">Title is required.</p>
            )}
          </div>

          {/* Description */}
          <div className="field-group">
            <label htmlFor="description">
              Description <span className="field-optional">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add any extra details…"
              rows={3}
              className="task-textarea"
            />
          </div>

          {/* Status */}
          <div className="field-group">
            <label htmlFor="status">Status</label>
            <div className="input-wrap">
              <span className="input-icon">&#128204;</span>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="task-select"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Completed */}
          <div className="field-group">
            <label className="task-checkbox-label">
              <input
                type="checkbox"
                name="completed"
                checked={form.completed}
                onChange={handleChange}
                className="task-checkbox"
              />
              Mark as completed
            </label>
          </div>

          {/* Actions */}
          <div className="addtask-actions">
            <Link to="/tasks" className="btn-secondary addtask-cancel">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary addtask-submit">
              {loading ? "Adding…" : "Add Task"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}