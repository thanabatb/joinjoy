"use client";

import { useRouter } from "next/navigation";

export function HistoryBackButton({
  ariaLabel = "Go back",
  children,
  className,
  fallbackHref
}: {
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  fallbackHref: string;
}) {
  const router = useRouter();

  function handleClick() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button aria-label={ariaLabel} className={className} onClick={handleClick} type="button">
      {children ?? <span>←</span>}
    </button>
  );
}
