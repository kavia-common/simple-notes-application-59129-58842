import React from "react";
import { formatDistanceToNow } from "date-fns";

/**
 * Props:
 * - notes: array of { id, title, content, created_at, updated_at }
 * - onEdit: (note) => void
 * - onDelete: (note) => void
 * - loading: boolean
 */
export default function NotesList({ notes, onEdit, onDelete, loading }) {
  if (loading) {
    return <div className="list-placeholder">Loading notes…</div>;
  }
  if (!notes?.length) {
    return (
      <div className="list-placeholder">
        No notes yet. Create your first note!
      </div>
    );
  }
  return (
    <ul className="notes-list" aria-live="polite">
      {notes.map((n) => (
        <li key={n.id} className="note-card">
          <div className="note-card-header">
            <h3 className="note-title">{n.title}</h3>
            <div className="note-meta">
              <span title={n.updated_at}>
                {n.updated_at
                  ? `Updated ${formatDistanceToNow(new Date(n.updated_at), {
                      addSuffix: true,
                    })}`
                  : ""}
              </span>
            </div>
          </div>
          <p className="note-content">{n.content}</p>
          <div className="note-actions">
            <button
              className="btn btn-small"
              onClick={() => onEdit(n)}
              aria-label={`Edit note ${n.title}`}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-small btn-danger"
              onClick={() => onDelete(n)}
              aria-label={`Delete note ${n.title}`}
            >
              🗑️ Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
