"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddParticipantForm({ shareToken }: { shareToken: string }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const response = await fetch(`/api/events/${shareToken}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, isHost: false })
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error?.message ?? "Unable to add participant.");
      setIsPending(false);
      return;
    }

    setDisplayName("");
    router.refresh();
  }

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <div className="toolbar">
        <h2 className="section-title">Add members</h2>
        <span className="eyebrow">Fast invite</span>
      </div>
      <div className="field">
        <label htmlFor="participant-name">Member name</label>
        <input
          id="participant-name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="A new friend joins the table"
          required
        />
      </div>
      {error ? <div className="notice">{error}</div> : null}
      <div className="button-row">
        <button className="button-secondary" disabled={isPending} type="submit">
          {isPending ? "Adding..." : "Add member"}
        </button>
      </div>
    </form>
  );
}
