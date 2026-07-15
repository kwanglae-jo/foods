/**
 * 사이트/회사 정보를 한 곳에서 관리한다.
 * 기존 코드에 흩어져 있던 값(대표자명, 사업자번호, 주소 등)은 검증되지 않은
 * 예시 값이었다. 실제 운영 전 담당 부서 확인을 거쳐 아래 값을 교체해야 한다.
 * "TODO(검수 필요)" 주석이 붙은 항목은 실제 값 확인 전까지 그대로 두지 말 것.
 */
export const SITE_URL = "https://foods-ecru.vercel.app";

export const SITE_CONFIG = {
  brandName: "샤브광",
  brandNameEn: "Shabugwang",

  // TODO(검수 필요): 실제 법인명으로 교체
  legalName: "(주)샤브광",
  // TODO(검수 필요): 실제 대표자명으로 교체
  ceoName: "홍길동",
  // TODO(검수 필요): 실제 사업자등록번호로 교체
  businessRegistrationNumber: "000-00-00000",
  // TODO(검수 필요): 실제 사업장 주소로 교체
  address: "서울특별시 강남구 테헤란로 000",
  // TODO(검수 필요): 실제 대표 연락처로 교체
  phone: "000-0000-0000",
  // TODO(검수 필요): 실제 수신 가능한 이메일로 교체
  email: "contact@shabugwang.example.com",

  /**
   * 보도자료 상세페이지의 "미디어 문의" 영역에 노출된다.
   * 값이 없으면 해당 섹션 자체가 렌더링되지 않으므로, 확인되지 않은 담당자
   * 정보를 임의로 채우지 않는다. 실제 홍보 담당자가 확정되면 채울 것.
   */
  mediaContact: {
    name: undefined as string | undefined,
    email: undefined as string | undefined,
    phone: undefined as string | undefined,
  },
} as const;
