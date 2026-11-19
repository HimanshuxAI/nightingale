-- ═══════════════════════════════════════════════════════════════════════════
-- Nightingale — Supabase schema
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run
-- Prototype-grade RLS: authenticated staff can read/write ops tables.
-- Hardening (per-project policies, roles, retention) is listed in the report.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Devices: the monitored fleet ───────────────────────────────────────────
create table if not exists public.devices (
  device_id   text primary key,
  name        text not null,
  kind        text not null,
  unit        text not null,
  tier        int  not null check (tier between 0 and 3), -- 0 life-critical … 3 admin
  ip          text,
  created_at  timestamptz not null default now()
);

-- ── Incidents: one row per detection ───────────────────────────────────────
create table if not exists public.incidents (
  id           uuid primary key default gen_random_uuid(),
  incident_ref text not null unique,          -- engine-side id (stable across ticks)
  device_ref   text not null references public.devices(device_id) on delete cascade,
  device_name  text not null,
  kind         text,
  severity     text not null check (severity in ('watch','alert','critical')),
  status       text not null default 'open' check (status in ('open','contained','resolved')),
  score        numeric(5,1) not null default 0,   -- engine risk 0–100
  summary      text not null,
  evidence     jsonb not null default '[]'::jsonb,
  started_at   timestamptz not null default now(),
  contained_at timestamptz
);

-- ── Audit log: every operator action is on the record ──────────────────────
create table if not exists public.audit_log (
  id     uuid primary key default gen_random_uuid(),
  ts     timestamptz not null default now(),
  actor  text not null,
  action text not null,
  target text not null,
  detail text
);

create index if not exists incidents_device_idx  on public.incidents (device_ref, started_at desc);
create index if not exists audit_log_ts_idx      on public.audit_log (ts desc);

-- ── Row Level Security ─────────────────────────────────────────────────────
alter table public.devices   enable row level security;
alter table public.incidents enable row level security;
alter table public.audit_log enable row level security;

do $$
declare t text;
begin
  foreach t in array array['devices','incidents','audit_log'] loop
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true);',
      t || '_auth_all', t
    );
  end loop;
end $$;
