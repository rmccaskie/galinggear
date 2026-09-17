# Supabase — Galing Gear

Database: PostgreSQL via Supabase (free tier).

## Running the migration

### Option A — Supabase SQL editor (recommended for phase 1)

1. Open your project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → **New query**.
3. Paste the contents of `migrations/0001_subscribers.sql`.
4. Click **Run**.

### Option B — Supabase CLI

```bash
supabase login
supabase db push
```

Requires the Supabase CLI and a `supabase/config.toml` — only needed if you are managing migrations locally.

## Table: subscribers

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, auto-generated |
| `name` | `text` | Required, 1–80 chars after trim |
| `email` | `text` | Required, unique |
| `created_at` | `timestamptz` | Set automatically |

## Row Level Security

RLS is enabled. The anon key (used by the subscribe API) has **INSERT only**. No anon SELECT, UPDATE, or DELETE is permitted.

This means:
- Subscribers cannot query or modify their own record.
- The service-role key (admin access) is **not used** in the codebase and must never be committed.

## Environment variables

The site reads two server-side environment variables. Set them in Cloudflare Pages (see `docs/CLOUDFLARE.md`):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Find these in Supabase → Settings → API.
