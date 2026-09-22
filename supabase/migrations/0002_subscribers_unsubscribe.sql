-- Migration: 0002_subscribers_unsubscribe
-- Adds an `unsubscribe` flag to the subscribers table.
--
-- Default false: every existing and new subscriber is considered active.
-- When the unsubscribe feature is built, set this to true for people who opt
-- out — their row is KEPT (so we retain history and can detect re-subscribes).
-- A re-subscribe flow should look the person up by email and flip this back to
-- false rather than inserting a duplicate row.
--
-- Run this in the Supabase SQL editor (or via `supabase db push`).

ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS unsubscribe boolean NOT NULL DEFAULT false;

-- Partial index: the dashboard and future mailing queries filter on active
-- (non-unsubscribed) rows, so index those for fast counts.
CREATE INDEX IF NOT EXISTS subscribers_active_idx
  ON subscribers (created_at DESC)
  WHERE unsubscribe = false;
