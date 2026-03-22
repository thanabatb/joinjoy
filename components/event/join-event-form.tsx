"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type JoinEventErrors = {
  displayName?: string;
  form?: string;
};

export function JoinEventForm({
  eventTitle,
  shareToken
}: {
  eventTitle: string;
  shareToken: string;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<JoinEventErrors>({});
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setErrors({ displayName: "Oops, add your name first." });
      return;
    }

    setIsPending(true);
    setErrors({});

    const response = await fetch(`/api/events/${shareToken}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: trimmedName,
        isHost: false
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setErrors({
        form: payload.error?.message ?? "Couldn’t join just yet. Try again."
      });
      setIsPending(false);
      return;
    }

    router.push(`/event/${shareToken}/summary`);
    router.refresh();
  }

  return (
    <form className="join-event-form" noValidate onSubmit={handleSubmit}>
      <section className="join-event-card">
        <div className="stack" style={{ gap: 16 }}>
          <span className="join-event-eyebrow">Join Event</span>
          <h1 className="join-event-title">{eventTitle}</h1>
          <p className="join-event-description">
            Add your name first so everyone can see who claimed each item.
          </p>
        </div>

        <div className="field">
          <label htmlFor="displayName">Your name</label>
          <input
            aria-invalid={Boolean(errors.displayName)}
            className={errors.displayName ? "field-input-error" : undefined}
            id="displayName"
            onChange={(event) => {
              setDisplayName(event.target.value);
              setErrors((current) => ({ ...current, displayName: undefined, form: undefined }));
            }}
            placeholder="Enter the name your group will recognize"
            value={displayName}
          />
          {errors.displayName ? <p className="field-error">{errors.displayName}</p> : null}
        </div>

        {errors.form ? <p className="join-event-error">{errors.form}</p> : null}

        <button className="join-event-submit" disabled={isPending} type="submit">
          {isPending ? "Joining..." : "Join now"}
        </button>
      </section>
    </form>
  );
}
