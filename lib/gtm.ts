"use client";

type GtmPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** GTM dataLayer로 커스텀 이벤트를 보낸다. 개인정보(이름/연락처 등)는 절대 포함하지 않는다. */
export function pushGtmEvent(event: string, payload: GtmPayload = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}
