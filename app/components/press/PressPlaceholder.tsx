import Image from "next/image";

/**
 * 대표 이미지가 없는 콘텐츠에 사용하는 브랜드 그래픽 플레이스홀더.
 * 실제 사진이 아니므로 장식 요소로 취급해 alt는 비워둔다.
 */
export default function PressPlaceholder({
  variant = "thumbnail",
}: {
  variant?: "thumbnail" | "hero";
}) {
  return (
    <div className={`press-placeholder press-placeholder--${variant}`} aria-hidden="true">
      <div className="press-placeholder__ring" />
      <Image src="/logo.png" alt="" width={variant === "hero" ? 56 : 32} height={variant === "hero" ? 56 : 32} />
    </div>
  );
}
