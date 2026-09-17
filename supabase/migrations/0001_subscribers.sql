-- Migration: 0001_subscribers
-- Creates the subscribers table for Galing Gear phase 1.
-- Run this in the Supabase SQL editor or via `supabase db push`.

CREATE TABLE subscribers (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 80),
  email      text        NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security.
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Anon users may INSERT only.
-- No SELECT, UPDATE, or DELETE policy for anon — they cannot read back their own row.
CREATE POLICY "anon_insert"
  ON subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);
