import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPost, updatePost, fetchPost } from "../api";
import Toast from "../components/Toast";

function toInputDate(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0];
}

export default function PostForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    title: "",
    dates: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    fetchPost(id)
      .then((res) => {
        const { title, dates, notes } = res.data;
        setForm({ title, dates: toInputDate(dates), notes });
      })
      .catch(() => setToast({ message: "Failed to load post", type: "error" }))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.notes.trim()) {
      setToast({ message: "Title and notes are required", type: "error" });
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await updatePost(id, form);
        setToast({ message: "Entry updated!" });
        setTimeout(() => navigate(`/post/${id}`), 800);
      } else {
        const res = await createPost(form);
        setToast({ message: "Entry created!" });
        setTimeout(() => navigate(`/post/${res.data._id}`), 800);
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong";
      setToast({ message: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner" /> Loading…
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="container">
        <header className="site-header">
          <div className="header-row">
            <h1>The Journey</h1>
          </div>
        </header>

        <div className="form-page">
          <button className="back-link" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h2 className="page-title">
            {isEdit ? (
              <>
                Edit <span>Entry</span>
              </>
            ) : (
              <>
                New <span>Blog</span>
              </>
            )}
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-control"
                value={form.title}
                onChange={handleChange}
                placeholder="blog title"
                maxLength={200}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className="form-control"
                value={form.dates}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                className="form-control textarea"
                value={form.notes}
                onChange={handleChange}
                placeholder="Write your thoughts here…"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Publish Entry"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}