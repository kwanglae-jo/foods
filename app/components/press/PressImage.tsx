import Image from "next/image";
import PressPlaceholder from "./PressPlaceholder";

type Props = {
  src?: string;
  alt?: string;
  variant?: "thumbnail" | "hero";
  priority?: boolean;
};

/**
 * 목록 썸네일/상세 대표 이미지 공용 컴포넌트.
 * - 로컬(/로 시작) 이미지는 Next.js 이미지 최적화를 사용한다.
 * - 관리자가 입력한 외부 URL은 next.config에 도메인을 등록하지 않고도 안전하게
 *   보여주기 위해 최적화 프록시를 거치지 않는 unoptimized 모드로 렌더링한다.
 * - 이미지가 없으면 브랜드 그래픽 플레이스홀더를 보여준다.
 */
export default function PressImage({ src, alt = "", variant = "thumbnail", priority = false }: Props) {
  if (!src) {
    return <PressPlaceholder variant={variant} />;
  }

  const isLocal = src.startsWith("/");

  return (
    <div className={`press-image press-image--${variant}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={variant === "hero" ? "(max-width: 768px) 100vw, 900px" : "(max-width: 640px) 100vw, 340px"}
        style={{ objectFit: "cover" }}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        unoptimized={!isLocal}
      />
    </div>
  );
}
