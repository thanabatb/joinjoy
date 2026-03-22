"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MarkPaidButton({
  shareToken,
  participantId
}: {
  shareToken: string;
  participantId: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function markPaid() {
    setIsPending(true);
    await fetch(`/api/events/${shareToken}/payments/mark-paid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId })
    });
    router.refresh();
  }

  return (
    <button className="button-secondary" disabled={isPending} onClick={markPaid} type="button">
      {isPending ? "Updating..." : "Mark as paid"}
    </button>
  );
}
