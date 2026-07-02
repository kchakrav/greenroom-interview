-- Optional GreenRoom question database schema.
-- The app uses this only when ENABLE_DATABASE_QUESTIONS=true and DATABASE_URL is set.
-- Without those env vars, it falls back to the static TypeScript question banks.

create table if not exists question_items (
  id text not null,
  kind text not null check (kind in ('question', 'concept')),
  discipline_id text not null,
  topic text not null,
  levels jsonb,
  question_type text,
  difficulty integer,
  source text not null default '',
  prompt text not null,
  guidance text not null,
  options jsonb,
  correct_index integer,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (kind, id)
);

create index if not exists question_items_kind_topic_idx on question_items (kind, topic);
create index if not exists question_items_kind_discipline_idx on question_items (kind, discipline_id);
create index if not exists question_items_kind_status_idx on question_items (kind, status);
create index if not exists question_items_levels_gin_idx on question_items using gin (levels);
create index if not exists question_items_search_idx
  on question_items using gin (to_tsvector('english', prompt || ' ' || guidance || ' ' || topic || ' ' || source));
