-- JoinJoy — Supabase Schema
-- MVP schema for event-based shared expense claiming
-- Recommended: run in Supabase SQL editor

create extension if not exists "pgcrypto";

-- =========================================================
-- 1) EVENTS
-- =========================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  share_token text not null unique,
  title text not null,
  venue_name text,
  occurred_at timestamptz not null default now(),
  currency text not null default 'THB',
  service_charge_type text not null default 'percentage'
    check (service_charge_type in ('none', 'percentage', 'custom_amount')),
  service_charge_rate numeric(8,4) not null default 10.0000,
  vat_type text not null default 'percentage'
    check (vat_type in ('none', 'percentage', 'custom_amount')),
  vat_rate numeric(8,4) not null default 7.0000,
  status text not null default 'draft'
    check (status in ('draft', 'claiming', 'needs_review', 'finalized', 'settled')),
  host_name text,
  calculation_note text,
  finalized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_events_share_token on public.events(share_token);
create index if not exists idx_events_status on public.events(status);

-- =========================================================
-- 2) PARTICIPANTS
-- =========================================================
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  display_name text not null,
  joined_at timestamptz,
  is_host boolean not null default false,
  status text not null default 'invited'
    check (status in ('invited', 'joined', 'claimed', 'paid')),
  browser_fingerprint text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_participants_event_id on public.participants(event_id);
create index if not exists idx_participants_event_name on public.participants(event_id, display_name);

-- Optional: helps reduce accidental exact duplicates in same event
create unique index if not exists uq_participants_event_display_name
  on public.participants(event_id, lower(display_name));

-- =========================================================
-- 3) ITEMS
-- =========================================================
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  price numeric(12,2) not null check (price >= 0),
  quantity integer not null default 1 check (quantity > 0),
  total_price numeric(12,2) generated always as (price * quantity) stored,
  assignment_mode text not null default 'unclaimed'
    check (assignment_mode in ('unclaimed', 'host_assigned', 'claim_later', 'shared_selected')),
  status text not null default 'unclaimed'
    check (status in ('unclaimed', 'partial', 'claimed', 'resolved')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_items_event_id on public.items(event_id);
create index if not exists idx_items_event_status on public.items(event_id, status);

-- =========================================================
-- 4) ITEM CLAIMS
-- one item can be split across many participants
-- =========================================================
create table if not exists public.item_claims (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  split_amount numeric(12,2) not null check (split_amount >= 0),
  split_ratio numeric(12,6),
  created_by_type text not null default 'participant'
    check (created_by_type in ('participant', 'host', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_item_claims_event_id on public.item_claims(event_id);
create index if not exists idx_item_claims_item_id on public.item_claims(item_id);
create index if not exists idx_item_claims_participant_id on public.item_claims(participant_id);

-- Prevent exact duplicate participant-item claim rows in MVP
create unique index if not exists uq_item_claims_item_participant
  on public.item_claims(item_id, participant_id);

-- =========================================================
-- 5) PAYOUT METHODS
-- one event -> one payout setup in MVP
-- =========================================================
create table if not exists public.payout_methods (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique references public.events(id) on delete cascade,
  payout_type text not null default 'bank_account'
    check (payout_type in ('bank_account', 'promptpay_qr', 'mixed')),
  recipient_name text,
  bank_name text,
  account_number text,
  qr_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 6) PAYMENT STATUSES
-- final snapshot per participant after finalization
-- =========================================================
create table if not exists public.payment_statuses (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  final_subtotal numeric(12,2) not null default 0,
  final_service_charge numeric(12,2) not null default 0,
  final_vat numeric(12,2) not null default 0,
  final_total numeric(12,2) not null default 0,
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'marked_paid', 'confirmed')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_id, participant_id)
);

create index if not exists idx_payment_statuses_event_id on public.payment_statuses(event_id);
create index if not exists idx_payment_statuses_event_payment on public.payment_statuses(event_id, payment_status);

-- =========================================================
-- 7) UPDATED_AT TRIGGER
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_events_set_updated_at on public.events;
create trigger trg_events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists trg_participants_set_updated_at on public.participants;
create trigger trg_participants_set_updated_at
before update on public.participants
for each row execute function public.set_updated_at();

drop trigger if exists trg_items_set_updated_at on public.items;
create trigger trg_items_set_updated_at
before update on public.items
for each row execute function public.set_updated_at();

drop trigger if exists trg_item_claims_set_updated_at on public.item_claims;
create trigger trg_item_claims_set_updated_at
before update on public.item_claims
for each row execute function public.set_updated_at();

drop trigger if exists trg_payout_methods_set_updated_at on public.payout_methods;
create trigger trg_payout_methods_set_updated_at
before update on public.payout_methods
for each row execute function public.set_updated_at();

drop trigger if exists trg_payment_statuses_set_updated_at on public.payment_statuses;
create trigger trg_payment_statuses_set_updated_at
before update on public.payment_statuses
for each row execute function public.set_updated_at();

-- =========================================================
-- 8) HELPER VIEW: participant subtotals before finalization
-- =========================================================
create or replace view public.v_participant_subtotals as
select
  ic.event_id,
  ic.participant_id,
  round(coalesce(sum(ic.split_amount), 0), 2) as subtotal
from public.item_claims ic
group by ic.event_id, ic.participant_id;

-- =========================================================
-- 9) HELPER VIEW: event subtotals
-- =========================================================
create or replace view public.v_event_subtotals as
select
  i.event_id,
  round(coalesce(sum(i.total_price), 0), 2) as event_subtotal
from public.items i
group by i.event_id;

-- =========================================================
-- 10) OPTIONAL FUNCTION: refresh item status
-- updates item status based on total claims
-- =========================================================
create or replace function public.refresh_item_status(p_item_id uuid)
returns void
language plpgsql
as $$
declare
  v_item_total numeric(12,2);
  v_claim_total numeric(12,2);
begin
  select total_price into v_item_total
  from public.items
  where id = p_item_id;

  select coalesce(sum(split_amount), 0) into v_claim_total
  from public.item_claims
  where item_id = p_item_id;

  update public.items
  set status =
    case
      when v_claim_total = 0 then 'unclaimed'
      when v_claim_total < v_item_total then 'partial'
      else 'claimed'
    end
  where id = p_item_id;
end;
$$;

-- =========================================================
-- 11) OPTIONAL FUNCTION: finalize event
-- Rule used here:
--   SC = event_subtotal * service_charge_rate / 100
--   VAT = event_subtotal * vat_rate / 100
-- Both allocated proportionally by participant subtotal / event subtotal
-- =========================================================
create or replace function public.finalize_event(p_event_id uuid)
returns void
language plpgsql
as $$
declare
  v_event_subtotal numeric(12,2);
  v_sc_rate numeric(8,4);
  v_vat_rate numeric(8,4);
  v_sc_type text;
  v_vat_type text;
  v_sc_total numeric(12,2);
  v_vat_total numeric(12,2);
begin
  select
    coalesce(sum(i.total_price), 0),
    e.service_charge_rate,
    e.vat_rate,
    e.service_charge_type,
    e.vat_type
  into
    v_event_subtotal,
    v_sc_rate,
    v_vat_rate,
    v_sc_type,
    v_vat_type
  from public.events e
  left join public.items i on i.event_id = e.id
  where e.id = p_event_id
  group by e.id, e.service_charge_rate, e.vat_rate, e.service_charge_type, e.vat_type;

  if v_sc_type = 'none' then
    v_sc_total := 0;
  elsif v_sc_type = 'custom_amount' then
    v_sc_total := round(v_sc_rate, 2);
  else
    v_sc_total := round(v_event_subtotal * v_sc_rate / 100.0, 2);
  end if;

  if v_vat_type = 'none' then
    v_vat_total := 0;
  elsif v_vat_type = 'custom_amount' then
    v_vat_total := round(v_vat_rate, 2);
  else
    v_vat_total := round(v_event_subtotal * v_vat_rate / 100.0, 2);
  end if;

  delete from public.payment_statuses
  where event_id = p_event_id;

  insert into public.payment_statuses (
    event_id,
    participant_id,
    final_subtotal,
    final_service_charge,
    final_vat,
    final_total,
    payment_status
  )
  select
    p_event_id,
    p.id as participant_id,
    round(coalesce(ps.subtotal, 0), 2) as final_subtotal,
    case
      when v_event_subtotal = 0 then 0
      else round(v_sc_total * coalesce(ps.subtotal, 0) / v_event_subtotal, 2)
    end as final_service_charge,
    case
      when v_event_subtotal = 0 then 0
      else round(v_vat_total * coalesce(ps.subtotal, 0) / v_event_subtotal, 2)
    end as final_vat,
    round(
      coalesce(ps.subtotal, 0)
      + case when v_event_subtotal = 0 then 0 else round(v_sc_total * coalesce(ps.subtotal, 0) / v_event_subtotal, 2) end
      + case when v_event_subtotal = 0 then 0 else round(v_vat_total * coalesce(ps.subtotal, 0) / v_event_subtotal, 2) end
    , 2) as final_total,
    'unpaid'
  from public.participants p
  left join public.v_participant_subtotals ps
    on ps.event_id = p.event_id and ps.participant_id = p.id
  where p.event_id = p_event_id;

  update public.events
  set status = 'finalized',
      finalized_at = now()
  where id = p_event_id;
end;
$$;

-- =========================================================
-- 12) STORAGE NOTE
-- Create a Supabase Storage bucket manually for payout QR images.
-- Suggested bucket name: payout-qr
-- =========================================================
