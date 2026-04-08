import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getTaskById, updateTask } from "../../services/taskService";

const STATUSES = [
  { value: "Pending",   label: "Pending" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm]           = useState({ title: "", description: "", status: "Pending", deadline: "" });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const task = await getTaskById(id);
        setForm({
          title: task.title,
          description: task.description || "",
          status: task.status,
          deadline: task.deadline ? task.deadline.slice(0, 16) : ""
        });
      } catch {
        setError("Task not found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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

    setSaving(true);
    try {
      await updateTask(id, {
        ...form,
        deadline: form.deadline || null
      });
      navigate("/tasks");
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-page">
        <p className="text-gray-400 text-sm">Loading task…</p>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">

        <div className="auth-brand">
          <h1 className="page-header" style={{ marginBottom: 0 }}>Edit Task</h1>
          <p className="page-subheader" style={{ marginBottom: 0 }}>Update the details below</p>
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
            <button type="submit" disabled={saving} className="btn-primary addtask-submit">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}