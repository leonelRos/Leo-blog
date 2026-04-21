import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPost, deletePost } from "../api";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

function formatFullDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchPost(id)
      .then((res) => setPost(res.data))
      .catch(() => setToast({ message: "Post not found", type: "error" }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePost(id);
      navigate("/");
    } catch {
      setToast({ message: "Failed to delete post", type: "error" });
      setShowDelete(false);
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

  if (!post) return null;

  return (
    <main>
      <div className="container">
        <header className="site-header">
          <div className="header-row">
            <h1>The Journal</h1>
          </div>
        </header>

        <article style={{ maxWidth: 680 }}>
          <button className="back-link" onClick={() => navigate("/")}>
            ← All Entries
          </button>

          <p className="post-detail-date">{formatFullDate(post.dates)}</p>
          <h1 className="post-detail-title">{post.title}</h1>

          <div className="post-detail-actions">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate(`/edit/${post._id}`)}
            >
              Edit Entry
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
          </div>

          <div className="post-detail-divider" />
          <p className="post-detail-notes">{post.notes}</p>
        </article>
      </div>

      {showDelete && (
        <ConfirmModal
          title="Delete this entry?"
          message={`"${post.title}" will be permanently removed.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

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