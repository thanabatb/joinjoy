"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function FinalizeEventButton({ shareToken }: { shareToken: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function finalizeEvent() {
    setIsPending(true);
    setError(null);

    const response = await fetch(`/api/events/${shareToken}/finalize`, {
      method: "POST"
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error?.message ?? "Unable to finalize event.");
      setIsPending(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="stack">
      <button className="button" disabled={isPending} onClick={finalizeEvent} type="button">
        {isPending ? "Finalizing..." : "Finalize event"}
      </button>
      {error ? <span className="notice">{error}</span> : null}
    </div>
  );
}
