"use client";

import Link, { type LinkProps } from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { pushGtmEvent } from "../../../lib/gtm";

type GtmPayload = Record<string, string | number | boolean | undefined>;

type Props = LinkProps &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & {
    event: string;
    payload?: GtmPayload;
  };

export default function TrackedPressLink({ event, payload, onClick, ...props }: Props) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    pushGtmEvent(event, payload);
    onClick?.(e);
  }

  return <Link {...props} onClick={handleClick} />;
}
