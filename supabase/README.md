# Supabase setup

1. Dashboard → **SQL Editor** → New query → paste `schema.sql` → **Run**.
   Creates `devices`, `incidents`, `audit_log` with RLS (authenticated users full access —
   prototype-grade; see the report's hardening roadmap).
2. Dashboard → **Settings → API**: copy the *Project URL* and the *Publishable (or anon) key*.
3. `.env.local` in the repo root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<project url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable or anon key>
   ```
4. For instant demo signups: **Authentication → Providers → Email → turn off "Confirm email"**.
5. Restart the app. The login page switches to real email/password auth; incidents and audit
   entries now persist. Devices seed themselves into the `devices` table on first tick.

Keys are server- and browser-safe (publishable key) — but keep `.env.local` out of git; the
repo ships `.env.example` placeholders instead.
