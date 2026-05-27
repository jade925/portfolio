"use client";

import { usePageTransition } from "@/context/TransitionContext";
import { CSSProperties, ReactNode, MouseEvent } from "react";

export default function TransitionLink({
  href,
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
}: {
  href        : string;
  children    : ReactNode;
  className?  : string;
  style?      : CSSProperties;
  onMouseEnter?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const { navigate } = usePageTransition();

  return (
    <a
      href={href}
      onClick={e => { e.preventDefault(); navigate(href); }}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
}
