/*
  # Create Todos Table

  1. New Tables
    - `todos`
      - `id` (uuid, primary key) - Unique identifier for each todo
      - `title` (text) - The todo task title/description
      - `completed` (boolean) - Whether the task is completed or not
      - `created_at` (timestamptz) - Timestamp when the todo was created
      - `user_id` (uuid) - Foreign key to auth.users (for future auth integration)

  2. Security
    - Enable RLS on `todos` table
    - Add policy for public access (select, insert, update, delete)
    - Note: Currently set to public access for testing. In production, 
      you should restrict to authenticated users only.

  3. Indexes
    - Index on created_at for efficient sorting
    - Index on completed for filtering
*/

CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select todos"
  ON todos
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert todos"
  ON todos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update todos"
  ON todos
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete todos"
  ON todos
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS todos_created_at_idx ON todos(created_at DESC);
CREATE INDEX IF NOT EXISTS todos_completed_idx ON todos(completed);