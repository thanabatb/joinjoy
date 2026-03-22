-- JoinJoy — Migration: add occurred_at to events
-- Run this on existing databases created before occurred_at was added

alter table public.events
add column if not exists occurred_at timestamptz;

update public.events
set occurred_at = coalesce(occurred_at, created_at, now())
where occurred_at is null;

alter table public.events
alter column occurred_at set default now();

alter table public.events
alter column occurred_at set not null;
