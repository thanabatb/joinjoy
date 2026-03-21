"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function JoinEventForm({
  eventTitle,
  shareToken
}: {
  eventTitle: string;
  shareToken: string;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const response = await fetch(`/api/events/${shareToken}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName,
        isHost: false
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error?.message ?? "Unable to join this event.");
      setIsPending(false);
      return;
    }

    router.push(`/event/${shareToken}/summary`);
    router.refresh();
  }

  return (
    <form className="join-event-form" onSubmit={handleSubmit}>
      <section className="join-event-card">
        <div className="stack" style={{ gap: 16 }}>
          <span className="join-event-eyebrow">Join Event</span>
          <h1 className="join-event-title">{eventTitle}</h1>
          <p className="join-event-description">
            Enter your name first, then you can claim or unclaim the items you had.
          </p>
        </div>

        <div className="field">
          <label htmlFor="displayName">Your name</label>
          <input
            id="displayName"
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Thanabat"
            required
            value={displayName}
          />
        </div>

        {error ? <p className="join-event-error">{error}</p> : null}

        <button className="join-event-submit" disabled={isPending} type="submit">
          {isPending ? "Joining..." : "Continue to summary"}
        </button>
      </section>
    </form>
  );
}
