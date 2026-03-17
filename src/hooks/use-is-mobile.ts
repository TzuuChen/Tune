"use client";

import { useEffect, useState } from "react";

/** Tailwind md 斷點 768px，小於此視為 mobile */
const MOBILE_BREAKPOINT_PX = 768;
const MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`;

/**
 * 偵測目前 viewport 是否為 mobile（寬度 < 768px）。
 * SSR 時回傳 false，client 掛載後會依實際寬度更新。
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(MEDIA_QUERY);
    const onChange = () => setIsMobile(mql.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
