/*
  # Chat Sessions and Messages Schema

  This migration creates the foundational tables for Sage SDGs AI chat persistence.

  1. New Tables
    - `chat_sessions`: Stores user chat sessions with agent associations
      - `id` (uuid, primary key)
      - `agent_id` (text, identifies which AI agent was used)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_messages`: Stores individual messages within sessions
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key to chat_sessions)
      - `role` (text, 'user' or 'assistant')
      - `content` (text, message content)
      - `agent_id` (text, optional, which agent responded)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Policy: Anyone can read/write (public demo access)
    - Note: For production with auth, these policies should be restricted to authenticated users
*/

CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  agent_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for public access (demo mode)
CREATE POLICY "Public can insert sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read sessions"
  ON chat_sessions FOR SELECT
  USING (true);

CREATE POLICY "Public can update sessions"
  ON chat_sessions FOR UPDATE
  USING (true);

CREATE POLICY "Public can insert messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read messages"
  ON chat_messages FOR SELECT
  USING (true);

-- Index for faster message queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
