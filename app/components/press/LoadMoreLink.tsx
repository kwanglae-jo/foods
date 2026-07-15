"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { pushGtmEvent } from "../../../lib/gtm";

export default function LoadMoreLink({ nextPage }: { nextPage: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  params.set("page", String(nextPage));

  return (
    <Link
      href={`${pathname}?${params.toString()}`}
      scroll={false}
      className="btn-outline press-load-more"
      onClick={() =>
        pushGtmEvent("press_load_more", {
          filter_type: params.get("type") ?? "all",
          filter_year: params.get("year") ?? "all",
        })
      }
    >
      더 보기
    </Link>
  );
}
