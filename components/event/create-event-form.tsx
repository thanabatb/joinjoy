"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const initialState = {
  title: "",
  venueName: "",
  occurredAt: new Date().toISOString().slice(0, 16),
  currency: "THB",
  serviceChargeType: "percentage",
  serviceChargeRate: "10",
  vatType: "percentage",
  vatRate: "7",
  hostName: ""
};

export function CreateEventForm() {
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
        ...form,
        occurredAt: new Date(form.occurredAt).toISOString(),
        serviceChargeRate: Number(form.serviceChargeRate),
        vatRate: Number(form.vatRate)
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error?.message ?? "Unable to create the event.");
      setIsPending(false);
      return;
    }

    router.push(`/event/${payload.shareToken}`);
  }

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <div className="toolbar">
        <h2 className="section-title">Create your outing</h2>
        <span className="eyebrow">Screen 2</span>
      </div>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="title">Event name</label>
          <input
            id="title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Birthday dinner at Sarnies"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="venue">Place</label>
          <input
            id="venue"
            value={form.venueName}
            onChange={(event) => setForm((current) => ({ ...current, venueName: event.target.value }))}
            placeholder="Sarnies Bangkok"
          />
        </div>
        <div className="field">
          <label htmlFor="hostName">Host name</label>
          <input
            id="hostName"
            value={form.hostName}
            onChange={(event) => setForm((current) => ({ ...current, hostName: event.target.value }))}
            placeholder="Thanabat"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="occurredAt">Date and time</label>
          <input
            id="occurredAt"
            type="datetime-local"
            value={form.occurredAt}
            onChange={(event) => setForm((current) => ({ ...current, occurredAt: event.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={form.currency}
            onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))}
          >
            <option value="THB">THB</option>
            <option value="USD">USD</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="serviceChargeType">Service charge</label>
          <select
            id="serviceChargeType"
            value={form.serviceChargeType}
            onChange={(event) =>
              setForm((current) => ({ ...current, serviceChargeType: event.target.value }))
            }
          >
            <option value="percentage">Percentage</option>
            <option value="custom_amount">Custom amount</option>
            <option value="none">None</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="serviceChargeRate">Service charge rate</label>
          <input
            id="serviceChargeRate"
            type="number"
            min="0"
            step="0.01"
            value={form.serviceChargeRate}
            onChange={(event) =>
              setForm((current) => ({ ...current, serviceChargeRate: event.target.value }))
            }
          />
        </div>
        <div className="field">
          <label htmlFor="vatType">VAT</label>
          <select
            id="vatType"
            value={form.vatType}
            onChange={(event) => setForm((current) => ({ ...current, vatType: event.target.value }))}
          >
            <option value="percentage">Percentage</option>
            <option value="custom_amount">Custom amount</option>
            <option value="none">None</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="vatRate">VAT rate</label>
          <input
            id="vatRate"
            type="number"
            min="0"
            step="0.01"
            value={form.vatRate}
            onChange={(event) => setForm((current) => ({ ...current, vatRate: event.target.value }))}
          />
        </div>
      </div>
      {error ? <div className="notice">{error}</div> : null}
      <div className="button-row">
        <button className="button" disabled={isPending} type="submit">
          {isPending ? "Creating..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
