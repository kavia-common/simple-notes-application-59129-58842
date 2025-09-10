import React, { useEffect, useState } from "react";

/**
 * Props:
 * - initial (optional): { title, content }
 * - onSubmit: (values) => void | Promise<void>
 * - onCancel: () => void
 * - submitting: boolean
 */
export default function NoteForm({ initial, onSubmit, onCancel, submitting }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!content.trim()) e.content = "Content is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ title: title.trim(), content: content.trim() });
  };

  return (
    <form className="note-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={errors.title ? "true" : "false"}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <div id="title-error" className="error">
            {errors.title}
          </div>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          placeholder="Write your note content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          aria-invalid={errors.content ? "true" : "false"}
          aria-describedby={errors.content ? "content-error" : undefined}
        />
        {errors.content && (
          <div id="content-error" className="error">
            {errors.content}
          </div>
        )}
      </div>

      <div className="actions">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
