-- Rolling Paper Creator — database schema (Neon Postgres)
-- Run this once against your Neon database (Neon console → SQL Editor,
-- or `psql "$DATABASE_URL" -f db/schema.sql`).
--
-- Design note: the app only ever talks to this database from the
-- server (Server Actions, via lib/db.ts and the DATABASE_URL secret).
-- There is no anon/public key exposed to the browser, so there's no
-- row-level security to configure here — every access check
-- (owner_token verification, lock state, etc.) lives in application
-- code instead.

create extension if not exists pgcrypto;

create table if not exists papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  recipient_name text,
  theme text not null check (theme in ('birthday', 'graduation', 'christmas', 'custom')),
  background_url text,
  owner_token uuid not null default gen_random_uuid(),
  is_locked boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references papers(id) on delete cascade,
  author_name text not null,
  content text not null,
  card_color text,
  created_at timestamptz not null default now()
);

create index if not exists messages_paper_id_idx on messages(paper_id);
