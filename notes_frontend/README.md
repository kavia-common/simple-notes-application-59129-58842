# Simple Notes Frontend (React + Supabase)

A lightweight, responsive notes application UI built with React and integrated with Supabase for CRUD operations.

## Features

- Create, view, edit, and delete notes
- Responsive, accessible UI with light/dark theme toggle
- Clear error handling and status indicators
- Minimal dependencies, fast and clean

## Environment Variables

Create a `.env` file in the project root with:

```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_public_key
```

Do NOT commit secrets to source control.

## Supabase Setup

Create a table named `notes` with the following suggested schema:

```sql
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- optional: keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
before update on public.notes
for each row execute procedure public.set_updated_at();

-- RLS (optional if enabling)
-- alter table public.notes enable row level security;
-- create policy "Public read/write notes" on public.notes
-- for select using (true)
-- for insert with check (true)
-- for update using (true)
-- for delete using (true);
```

Adjust policies to your security needs.

## Development

Install dependencies and start the app:

```
npm install
npm start
```

Open http://localhost:3000 to use the app.

## Scripts

- `npm start` - Start dev server
- `npm test` - Run tests
- `npm run build` - Build for production

## Project Structure

- `src/lib/supabaseClient.js` - Supabase client (uses env vars)
- `src/services/notesService.js` - CRUD operations
- `src/components/NoteForm.js` - Form for create/edit
- `src/components/NotesList.js` - Notes listing
- `src/App.js` - App shell and views
- `src/App.css` - Styles and responsive layout

## Troubleshooting

- If you see "Supabase is not configured", verify `.env` variables and restart dev server.
- Ensure table name is `notes` and fields match service expectations.
- Check browser console for Supabase error details.

## License

MIT
