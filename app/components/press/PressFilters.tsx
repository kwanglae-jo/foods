"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PRESS_TYPE_FILTER_OPTIONS, type PressType, type PressSort } from "../../../lib/press-types";
import { pushGtmEvent } from "../../../lib/gtm";

export default function PressFilters({
  availableYears,
  resultCount,
}: {
  availableYears: string[];
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchId = useId();
  const typeId = useId();
  const yearId = useId();
  const sortId = useId();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const type = (searchParams.get("type") as PressType | null) ?? "all";
  const year = searchParams.get("year") ?? "all";
  const sort = (searchParams.get("sort") as PressSort | null) ?? "latest";

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const updateParams = useCallback(
    (next: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(next).forEach(([key, value]) => {
        if (!value || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  function handleSearchChange(value: string) {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ q: value || undefined });
      pushGtmEvent("press_search", { search_term: value });
    }, 350);
  }

  function handleTypeChange(value: string) {
    updateParams({ type: value === "all" ? undefined : value });
    pushGtmEvent("press_filter_change", { filter_type: value });
  }

  function handleYearChange(value: string) {
    updateParams({ year: value === "all" ? undefined : value });
    pushGtmEvent("press_filter_change", { filter_year: value });
  }

  function handleSortChange(value: string) {
    updateParams({ sort: value === "latest" ? undefined : value });
  }

  return (
    <div className="press-filters">
      <div className="press-filters__row">
        <div className="field press-filters__search">
          <label htmlFor={searchId}>키워드 검색</label>
          <input
            id={searchId}
            type="search"
            placeholder="제목, 요약, 매체명으로 검색"
            value={q}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn-outline press-filters__mobile-toggle"
          aria-expanded={mobileOpen}
          aria-controls="press-filter-panel"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "필터 닫기" : "필터"}
        </button>
      </div>

      <div id="press-filter-panel" className={`press-filters__panel${mobileOpen ? " is-open" : ""}`}>
        <div className="field">
          <label htmlFor={typeId}>콘텐츠 유형</label>
          <select id={typeId} value={type} onChange={(e) => handleTypeChange(e.target.value)}>
            {PRESS_TYPE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={yearId}>연도</label>
          <select id={yearId} value={year} onChange={(e) => handleYearChange(e.target.value)}>
            <option value="all">전체 연도</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={sortId}>정렬</label>
          <select id={sortId} value={sort} onChange={(e) => handleSortChange(e.target.value)}>
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>

      <p className="press-filters__count" aria-live="polite">
        총 {resultCount.toLocaleString("ko-KR")}건의 소식
      </p>
    </div>
  );
}
