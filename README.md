# 샤브광 가맹점 모집 랜딩페이지

Figma 디자인을 Next.js로 구현하고, 문의 폼을 **Resend 이메일 발송**에 연결한 프로젝트입니다.

- 원본 디자인: [Figma](https://www.figma.com/design/LcY6q0pLxPJMAgbDKv2XVV/조광래?node-id=739-238)
- 스택: Next.js 15 (App Router) · React 19 · TypeScript · Resend

## 구조

```
app/
  page.tsx                 # 랜딩페이지 (Hero/장점/절차/통계/문의/FAQ/CTA/Footer)
  layout.tsx               # 공통 레이아웃 · 메타데이터
  globals.css              # 디자인 토큰 + 전체 스타일 (반응형 포함)
  components/
    InquiryForm.tsx        # 문의 폼 (클라이언트) → /api/inquiry 로 전송
  api/inquiry/route.ts     # Resend로 관리자에게 메일 발송
public/hero.jpg            # 히어로 배경 이미지
```

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

## 메일 발송 설정 (필수)

`.env.local` 파일에 아래 값을 채워야 실제 메일이 발송됩니다.

```bash
RESEND_API_KEY=re_xxxxxxxx        # https://resend.com/api-keys 에서 발급
INQUIRY_TO_EMAIL=admin@myshop.com # 문의를 받을 관리자 메일 (콤마로 여러 명 가능)
INQUIRY_FROM_EMAIL=샤브광 가맹문의 <onboarding@resend.dev>
```

### 발신 도메인 안내
- **테스트**: `onboarding@resend.dev` 로 두면 Resend 계정 소유자 본인 메일로만 발송됩니다.
- **실서비스**: [Resend에서 도메인 인증](https://resend.com/domains) 후, 인증한 도메인 주소(예: `noreply@myshop.com`)로 `INQUIRY_FROM_EMAIL` 을 바꾸세요.

값을 채운 뒤 개발 서버를 재시작하면 폼 제출 시 관리자에게 문의 메일이 도착합니다.

## 동작 방식
1. 방문자가 문의 폼 작성 → 제출
2. `InquiryForm` 이 `/api/inquiry` 로 JSON POST
3. 서버에서 필수값(이름·연락처·희망지역·예산) 검증
4. Resend API로 관리자에게 HTML 메일 발송
5. 성공/실패 메시지를 폼 하단에 표시
