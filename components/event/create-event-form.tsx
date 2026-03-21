"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function getLocalDateTimeParts() {
  const now = new Date();
  const date = new Intl.DateTimeFormat("en-CA").format(now);
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  return { date, time };
}

const defaultDateTime = getLocalDateTimeParts();

const initialState = {
  title: "",
  venueName: "",
  occurredDate: defaultDateTime.date,
  occurredTime: defaultDateTime.time,
  serviceChargeType: "percentage",
  serviceChargeRate: "10",
  vatType: "percentage",
  vatRate: "7",
  hostName: ""
};

function formatDateForRequest(date: string, time: string) {
  const safeTime = time || "19:00";
  return new Date(`${date}T${safeTime}`).toISOString();
}

export function CreateEventForm({ formId }: { formId: string }) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        venueName: form.venueName,
        occurredAt: formatDateForRequest(form.occurredDate, form.occurredTime),
        currency: "THB",
        serviceChargeType: form.serviceChargeType,
        serviceChargeRate: Number(form.serviceChargeRate),
        vatType: form.vatType,
        vatRate: Number(form.vatRate),
        hostName: form.hostName
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error?.message ?? "Unable to create the event.");
      setIsPending(false);
      return;
    }

    router.push(`/event/${payload.shareToken}/items`);
  }

  return (
    <form className="create-form" id={formId} onSubmit={handleSubmit}>
      <section className="create-card">
        <div className="create-card-glow" />
        <div className="stack" style={{ gap: 22, position: "relative", zIndex: 1 }}>
          <div className="field">
            <label htmlFor="title">What's the occasion?</label>
            <input
              id="title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Jazz Night"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="venue">Where to? Optional</label>
            <input
              id="venue"
              value={form.venueName}
              onChange={(event) => setForm((current) => ({ ...current, venueName: event.target.value }))}
              placeholder="The Local Bistro"
            />
          </div>

          <div className="field">
            <label htmlFor="hostName">Who's hosting?</label>
            <input
              id="hostName"
              value={form.hostName}
              onChange={(event) => setForm((current) => ({ ...current, hostName: event.target.value }))}
              placeholder="Thanabat"
              required
            />
          </div>

          <div className="create-two-up">
            <div className="field">
              <label htmlFor="occurredDate">When?</label>
              <input
                id="occurredDate"
                type="date"
                value={form.occurredDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, occurredDate: event.target.value }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="occurredTime">Time</label>
              <input
                id="occurredTime"
                type="time"
                value={form.occurredTime}
                onChange={(event) =>
                  setForm((current) => ({ ...current, occurredTime: event.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="create-settings-card">
        <div className="toolbar">
          <h3 className="create-settings-title">Cost Settings</h3>
          <div className="create-currency-pill">
            <span>THB</span>
            <span className="muted">MVP</span>
          </div>
        </div>

        <div className="stack" style={{ gap: 22 }}>
          <div className="stack" style={{ gap: 12 }}>
            <div className="toolbar">
              <span className="create-setting-label">Service Charge</span>
              <span className="create-setting-note">Optional</span>
            </div>
            <div className="create-chip-row">
              <button
                className={form.serviceChargeType === "none" ? "create-chip active secondary" : "create-chip"}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    serviceChargeType: "none",
                    serviceChargeRate: "0"
                  }))
                }
                type="button"
              >
                None
              </button>
              <button
                className={form.serviceChargeType === "percentage" && form.serviceChargeRate === "10" ? "create-chip active secondary" : "create-chip"}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    serviceChargeType: "percentage",
                    serviceChargeRate: "10"
                  }))
                }
                type="button"
              >
                10% Default
              </button>
              <button
                className={form.serviceChargeType === "custom_amount" ? "create-chip active secondary" : "create-chip"}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    serviceChargeType: "custom_amount",
                    serviceChargeRate: current.serviceChargeRate === "0" ? "10" : current.serviceChargeRate
                  }))
                }
                type="button"
              >
                Custom
              </button>
            </div>
            {form.serviceChargeType === "custom_amount" ? (
              <div className="field">
                <label htmlFor="serviceChargeRate">Custom service charge amount</label>
                <input
                  id="serviceChargeRate"
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.serviceChargeRate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, serviceChargeRate: event.target.value }))
                  }
                />
              </div>
            ) : null}
          </div>

          <div className="stack" style={{ gap: 12 }}>
            <div className="toolbar">
              <span className="create-setting-label">VAT / Tax</span>
              <span className="create-setting-note">Standard</span>
            </div>
            <div className="create-chip-row">
              <button
                className={form.vatType === "none" ? "create-chip active tertiary" : "create-chip"}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    vatType: "none",
                    vatRate: "0"
                  }))
                }
                type="button"
              >
                None
              </button>
              <button
                className={form.vatType === "percentage" && form.vatRate === "7" ? "create-chip active tertiary" : "create-chip"}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    vatType: "percentage",
                    vatRate: "7"
                  }))
                }
                type="button"
              >
                7% Default
              </button>
              <button
                className={form.vatType === "custom_amount" ? "create-chip active tertiary" : "create-chip"}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    vatType: "custom_amount",
                    vatRate: current.vatRate === "0" ? "7" : current.vatRate
                  }))
                }
                type="button"
              >
                Custom
              </button>
            </div>
            {form.vatType === "custom_amount" ? (
              <div className="field">
                <label htmlFor="vatRate">Custom VAT amount</label>
                <input
                  id="vatRate"
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.vatRate}
                  onChange={(event) => setForm((current) => ({ ...current, vatRate: event.target.value }))}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="create-tip-card">
        <div className="create-tip-icon">i</div>
        <p className="create-tip-copy">
          JoinJoy automatically splits the final bill including taxes, so you can focus on the
          moment, not the math.
        </p>
      </section>

      {error ? <div className="notice">{error}</div> : null}
      {isPending ? <div className="notice">Creating your event...</div> : null}
    </form>
  );
}
