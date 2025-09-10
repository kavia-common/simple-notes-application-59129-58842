import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import "./index.css";
import NotesList from "./components/NotesList";
import NoteForm from "./components/NoteForm";
import { isSupabaseConfigured } from "./lib/supabaseClient";
import { createNote, deleteNote, listNotes, updateNote } from "./services/notesService";

// PUBLIC_INTERFACE
function App() {
  /** Main application for managing notes. */
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
  const [activeNote, setActiveNote] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark theme. */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const supabaseReady = useMemo(() => isSupabaseConfigured(), []);

  const refreshNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listNotes();
      setNotes(data);
    } catch (e) {
      setError(e?.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (supabaseReady) {
      refreshNotes();
    } else {
      setLoading(false);
      setError(
        "Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY."
      );
    }
  }, [supabaseReady, refreshNotes]);

  const onCreate = async (values) => {
    try {
      setSubmitting(true);
      setError("");
      await createNote(values);
      await refreshNotes();
      setView("list");
    } catch (e) {
      setError(e?.message || "Failed to create note.");
    } finally {
      setSubmitting(false);
    }
  };

  const onUpdate = async (values) => {
    if (!activeNote) return;
    try {
      setSubmitting(true);
      setError("");
      await updateNote(activeNote.id, values);
      await refreshNotes();
      setActiveNote(null);
      setView("list");
    } catch (e) {
      setError(e?.message || "Failed to update note.");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (note) => {
    if (!window.confirm(`Delete note "${note.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      setError("");
      await deleteNote(note.id);
      await refreshNotes();
    } catch (e) {
      setError(e?.message || "Failed to delete note.");
    }
  };

  const startCreate = () => {
    setActiveNote(null);
    setView("create");
  };

  const startEdit = (note) => {
    setActiveNote(note);
    setView("edit");
  };

  const cancelForm = () => {
    setActiveNote(null);
    setView("list");
  };

  return (
    <div className="App">
      <header className="app-navbar">
        <div className="container">
          <div className="brand">
            <span className="logo">📝</span>
            <span className="brand-name">Simple Notes</span>
          </div>
          <div className="nav-actions">
            <button
              className="btn btn-outline"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            {view === "list" ? (
              <button className="btn btn-primary" onClick={startCreate}>
                + New Note
              </button>
            ) : (
              <button className="btn" onClick={cancelForm}>
                ← Back to list
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          {!supabaseReady && (
            <div className="alert alert-warning" role="alert">
              The app is running but Supabase is not configured. Set
              REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY, then restart.
            </div>
          )}

          {view === "list" && (
            <>
              <div className="section-header">
                <h2>Your Notes</h2>
                <button className="btn btn-primary" onClick={startCreate}>
                  + New Note
                </button>
              </div>
              <NotesList
                notes={notes}
                onEdit={startEdit}
                onDelete={onDelete}
                loading={loading}
              />
            </>
          )}

          {view === "create" && (
            <section className="panel">
              <h2>Create Note</h2>
              <NoteForm
                onSubmit={onCreate}
                onCancel={cancelForm}
                submitting={submitting}
              />
            </section>
          )}

          {view === "edit" && (
            <section className="panel">
              <h2>Edit Note</h2>
              <NoteForm
                initial={activeNote || undefined}
                onSubmit={onUpdate}
                onCancel={cancelForm}
                submitting={submitting}
              />
            </section>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <span>Built with React + Supabase</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
