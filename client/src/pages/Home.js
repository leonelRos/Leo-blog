import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts, deletePost } from "../api";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return {
    day: String(d.getDate()),
    month: d.toLocaleString("default", { month: "short" }).toUpperCase(),
    year: String(d.getFullYear()),
  };
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const loadPosts = useCallback(async () => {
    try {
      const res = await fetchPosts();
      setPosts(res.data);
    } catch {
      setToast({ message: "Failed to load posts", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleDelete = async () => {
    try {
      await deletePost(deleteTarget._id);
      setPosts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setToast({ message: "Post deleted", type: "success" });
    } catch {
      setToast({ message: "Failed to delete post", type: "error" });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <main>
      <div className="container">
        <header className="site-header">
          <div className="header-row">
            <div>
              <h1>The Journey</h1>
              <p>Thoughts & Notes</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/new")}>
              + New Blog
            </button>
          </div>
        </header>

        {loading ? (
          <div className="loading">
            <div className="spinner" /> Loading entries…
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✦</div>
            <h3>No entries yet</h3>
            <p>Start writing your first journal entry.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => {
              const d = formatDate(post.dates);
              return (
                <article
                  key={post._id}
                  className="post-card"
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  <div className="post-card-date">
                    <span className="post-card-day">{d.day}</span>
                    <span>{d.month}</span>
                    <span>{d.year}</span>
                  </div>
                  <div className="post-card-body">
                    <h2 className="post-card-title">{post.title}</h2>
                    <p className="post-card-excerpt">{post.notes}</p>
                  </div>
                  <div
                    className="post-card-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/edit/${post._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteTarget(post)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete this entry?"
          message={`"${deleteTarget.title}" will be permanently removed.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
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