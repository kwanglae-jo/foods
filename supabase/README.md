# Supabase 설정 가이드 (보도자료 관리 시스템)

이 저장소에는 실제 Supabase 프로젝트 키가 포함되어 있지 않습니다. 아래 순서대로 직접 프로젝트를 만들고 연결해야 합니다.

## 1. 프로젝트 생성 및 마이그레이션 적용

1. https://supabase.com 에서 새 프로젝트를 생성한다.
2. SQL Editor에서 `supabase/migrations/0001_press_admin.sql` → `0002_press_media_storage.sql` 순서로 실행한다.
   (Supabase CLI를 쓴다면 `supabase link` 후 `supabase db push`)

## 2. 환경변수 설정

`.env.example`을 참고해 `.env.local`(로컬)과 Vercel 프로젝트 환경변수(운영)에 아래 값을 채운다.

| 변수 | 위치 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API | 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API | anon(public) 키. 브라우저에 노출되어도 되는 키(RLS로 보호됨) |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API | **절대 클라이언트에 노출 금지.** 서버 라우트/크론에서만 사용 |
| `CRON_SECRET` | 직접 생성(임의의 긴 랜덤 문자열) | Vercel Cron이 `/api/cron/publish-scheduled` 호출 시 사용하는 인증 헤더 값 |

## 3. 첫 관리자 초대

1. Supabase Dashboard → Authentication → Users → **Invite user** 로 관리자 이메일을 초대한다(비밀번호는 코드에 하드코딩하지 않는다 — 초대 메일로 본인이 직접 설정).
2. 초대된 사용자의 `user_id`(UUID)를 Authentication → Users 목록에서 확인한다.
3. SQL Editor에서 아래를 실행해 역할을 부여한다(예시이며, `<USER_ID>`는 실제 값으로 교체):

```sql
insert into press_admin_profiles (user_id, role, display_name)
values ('<USER_ID>', 'admin', '홍보 담당자');
```

이 단계 전까지는 로그인은 되어도 `press_admin_profiles`에 행이 없어 관리자 화면에 접근할 수 없습니다(코드 상 `requireAdminProfile()`이 차단).

## 4. Storage 버킷 확인

`press-media` 버킷이 0002 마이그레이션으로 자동 생성됩니다(공개 읽기 전용, 쓰기는 서버 라우트의 service role만 가능). 별도 설정은 필요하지 않습니다.

## 5. Vercel Cron 설정

`vercel.json`에 15분 간격(`*/15 * * * *`)으로 정의된 스케줄이 배포 시 자동 등록됩니다. Vercel 프로젝트 환경변수에 `CRON_SECRET`을 등록하면 Vercel이 해당 값을 `Authorization: Bearer <값>` 헤더로 자동 첨부해 `/api/cron/publish-scheduled`를 호출하고, 예약 발행 글을 주기적으로 게시 처리합니다.

**주의:** Vercel Hobby(무료) 플랜은 Cron Job 실행 빈도가 하루 1회로 제한됩니다. 15분 간격이 필요하다면 Pro 이상 플랜이 필요합니다 — Hobby 플랜이라면 `vercel.json`의 `schedule`을 하루 1회(`0 0 * * *` 등)로 조정하세요. Cron은 Vercel 배포 환경에서만 동작하며, 로컬 개발에서는 `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/publish-scheduled`로 수동 호출해 테스트해야 합니다.

## 6. 로컬에서 직접 검증이 불가능했던 항목

이번 작업에서는 실제 Supabase 프로젝트가 없어 아래는 코드 작성 및 `next build`/타입체크까지만 확인했고, 런타임 동작(로그인, RLS, 업로드, 예약 발행)은 검증하지 못했습니다. 위 1~5 단계를 마친 뒤 반드시 스테이징에서 직접 확인하세요.
