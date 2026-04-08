import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTask } from "../../services/taskService";

const STATUSES = [
  { value: "Pending",   label: "Pending" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function AddTaskPage() {
  const navigate = useNavigate();

  const [form, setForm]           = useState({ title: "", description: "", status: "Pending", deadline: "" });
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      await createTask({
        ...form,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null
      });
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

          {/* Deadline */}
          <div className="field-group">
            <label htmlFor="deadline">Deadline</label>
            <div className="input-wrap">
              <span className="input-icon">&#128197;</span>
              <input
                id="deadline"
                name="deadline"
                type="datetime-local"
                value={form.deadline}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)} // prevent past dates
                className=""
              />
            </div>
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