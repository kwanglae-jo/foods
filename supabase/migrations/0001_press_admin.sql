-- 샤브광 뉴스룸 관리 시스템 스키마
-- 실행 방법: Supabase 프로젝트의 SQL Editor에 순서대로 붙여넣거나
-- `supabase db push` (Supabase CLI)로 적용한다.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 관리자 프로필 (역할: admin | editor)
-- 사용자 생성은 Supabase Dashboard > Authentication > Invite user 로 초대하고,
-- 초대된 사용자의 auth.users.id 를 이용해 이 테이블에 역할을 부여한다.
-- ---------------------------------------------------------------------------
create table if not exists press_admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'editor')),
  display_name text,
  created_at timestamptz not null default now()
);

alter table press_admin_profiles enable row level security;

drop policy if exists "profiles: self read" on press_admin_profiles;
create policy "profiles: self read"
  on press_admin_profiles for select
  to authenticated
  using (user_id = auth.uid());

-- insert/update/delete 정책을 부여하지 않는다: 역할 부여는 반드시
-- service role(Supabase Dashboard 또는 서버의 admin 클라이언트)로만 수행한다.

-- ---------------------------------------------------------------------------
-- 보도자료 / 언론 보도 / 브랜드 소식
-- ---------------------------------------------------------------------------
create table if not exists press_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null check (type in ('press-release', 'media-coverage', 'brand-news')),
  status text not null default 'draft'
    check (status in ('draft', 'in_review', 'scheduled', 'published', 'ended', 'archived')),
  title text not null,
  summary text not null default '',
  body_json jsonb not null default '{}'::jsonb,
  publish_at timestamptz,
  ended_at timestamptz,
  source_name text not null default '',
  source_url text,
  thumbnail_url text,
  hero_image_url text,
  image_alt text,
  attachment_url text,
  attachment_label text,
  author text,
  featured boolean not null default false,
  tags text[] not null default '{}',
  related_ids uuid[] not null default '{}',
  seo_title text,
  seo_description text,
  og_image_url text,
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists press_items_status_publish_at_idx on press_items (status, publish_at);
create index if not exists press_items_slug_idx on press_items (slug);
create index if not exists press_items_type_idx on press_items (type);

alter table press_items enable row level security;

-- 공개 열람: 발행 상태 + 발행 시각이 지난 + 삭제되지 않은 글만
drop policy if exists "press_items: public read published" on press_items;
create policy "press_items: public read published"
  on press_items for select
  to anon, authenticated
  using (
    status = 'published'
    and publish_at is not null
    and publish_at <= now()
    and deleted_at is null
  );

-- 관리자(로그인 + press_admin_profiles 등록자): 모든 상태 열람
drop policy if exists "press_items: admin read all" on press_items;
create policy "press_items: admin read all"
  on press_items for select
  to authenticated
  using (exists (select 1 from press_admin_profiles p where p.user_id = auth.uid()));

drop policy if exists "press_items: admin insert" on press_items;
create policy "press_items: admin insert"
  on press_items for insert
  to authenticated
  with check (exists (select 1 from press_admin_profiles p where p.user_id = auth.uid()));

drop policy if exists "press_items: admin update" on press_items;
create policy "press_items: admin update"
  on press_items for update
  to authenticated
  using (exists (select 1 from press_admin_profiles p where p.user_id = auth.uid()))
  with check (exists (select 1 from press_admin_profiles p where p.user_id = auth.uid()));

-- 물리 삭제(DELETE) 정책은 의도적으로 부여하지 않는다.
-- 삭제는 status='archived' + deleted_at 설정을 통한 soft delete만 허용하며,
-- 이는 위 update 정책으로 충분히 처리된다. 영구 삭제가 필요하면 service role로만 수행한다.

create or replace function press_items_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists press_items_set_updated_at_trigger on press_items;
create trigger press_items_set_updated_at_trigger
  before update on press_items
  for each row execute function press_items_set_updated_at();

-- ---------------------------------------------------------------------------
-- 감사 로그: 생성/수정/발행/게시종료/휴지통 이동 등 이력 기록
-- 클라이언트(anon/authenticated) insert 정책은 부여하지 않는다 — 서버 라우트가
-- service role 클라이언트로만 기록해 위조를 방지한다.
-- ---------------------------------------------------------------------------
create table if not exists press_audit_log (
  id uuid primary key default gen_random_uuid(),
  press_item_id uuid references press_items (id) on delete set null,
  actor_id uuid references auth.users (id),
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists press_audit_log_item_idx on press_audit_log (press_item_id, created_at desc);

alter table press_audit_log enable row level security;

drop policy if exists "audit_log: admin read" on press_audit_log;
create policy "audit_log: admin read"
  on press_audit_log for select
  to authenticated
  using (exists (select 1 from press_admin_profiles p where p.user_id = auth.uid()));
