-- 보도자료 이미지/PDF 저장용 공개 버킷.
-- 업로드/수정/삭제는 서버의 service role 클라이언트(/api/admin/upload)로만 수행하므로
-- authenticated/anon 대상 write 정책은 의도적으로 부여하지 않는다.

insert into storage.buckets (id, name, public)
values ('press-media', 'press-media', true)
on conflict (id) do nothing;

drop policy if exists "press-media: public read" on storage.objects;
create policy "press-media: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'press-media');
