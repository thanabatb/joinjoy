"use client";

import { useState } from "react";

export function ShareActions({
  shareToken,
  variant = "buttons"
}: {
  shareToken: string;
  variant?: "buttons" | "icon";
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window === "undefined"
      ? `/event/${shareToken}`
      : `${window.location.origin}/event/${shareToken}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function shareLink() {
    if (navigator.share) {
      await navigator.share({
        title: "JoinJoy Event",
        text: "Join this event on JoinJoy",
        url: shareUrl
      });
      return;
    }

    await copyLink();
  }

  return (
    variant === "icon" ? (
      <button
        aria-label={copied ? "Link copied" : "Share event"}
        className={`event-summary-share-icon${copied ? " copied" : ""}`}
        onClick={shareLink}
        title={copied ? "Link copied" : "Share event"}
        type="button"
      >
        {copied ? (
          <svg
            aria-hidden="true"
            className="event-summary-share-svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 12.5 9.2 16.5 19 7.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
            />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            className="event-summary-share-svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M14 5 19 5 19 10"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M10 14 19 5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M19 14.5V18a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V6.5A1.5 1.5 0 0 1 6 5h3.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        )}
      </button>
    ) : (
      <div className="summary-share-actions">
        <button className="summary-share-copy" onClick={copyLink} type="button">
          {copied ? "Copied" : "Copy Link"}
        </button>
        <button className="summary-share-primary" onClick={shareLink} type="button">
          Share
        </button>
      </div>
    )
  );
}
