import { supabase } from "../lib/supabaseClient";

/**
 * Notes table schema assumed:
 * - id: uuid (primary key, default uuid_generate_v4())
 * - title: text
 * - content: text
 * - created_at: timestamp with time zone (default now())
 * - updated_at: timestamp with time zone (default now())
 *
 * If your table differs, adjust the column names below accordingly.
 */

// PUBLIC_INTERFACE
export async function listNotes() {
  /** Fetch all notes ordered by updated_at desc. */
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  /** Create a new note. Returns created row. */
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("notes")
    .insert([{ title, content, created_at: now, updated_at: now }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }) {
  /** Update a note by id. Returns updated row. */
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("notes")
    .update({ title, content, updated_at: now })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. Returns true on success. */
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
  return true;
}
