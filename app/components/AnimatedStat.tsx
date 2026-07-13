"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

export default function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(value.replace(/[0-9,.]/g, (c) => (c >= "0" && c <= "9" ? "0" : c)));

  useEffect(() => {
    if (!isInView) return;

    const match = value.match(/[\d,]+(\.\d+)?/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const numStr = match[0];
    const target = parseFloat(numStr.replace(/,/g, ""));
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + numStr.length);
    const hasComma = numStr.includes(",");
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        const num = decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString();
        const formatted = hasComma
          ? Number(num).toLocaleString("ko-KR", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : num;
        setDisplay(`${prefix}${formatted}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return <div ref={ref}>{display}</div>;
}
