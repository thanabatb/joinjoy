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

type CreateEventErrors = Partial<Record<keyof typeof initialState, string>> & {
  form?: string;
};

function validateCreateEvent(form: typeof initialState): CreateEventErrors {
  const errors: CreateEventErrors = {};

  if (!form.title.trim()) {
    errors.title = "Oops, give this event a name.";
  }

  if (!form.hostName.trim()) {
    errors.hostName = "Oops, who’s hosting this one?";
  }

  if (!form.occurredDate) {
    errors.occurredDate = "Pick a date for this one.";
  }

  if (!form.occurredTime) {
    errors.occurredTime = "Pick a time too.";
  }

  if (form.serviceChargeType === "custom_amount") {
    const amount = Number(form.serviceChargeRate);

    if (!form.serviceChargeRate || Number.isNaN(amount) || amount < 0) {
      errors.serviceChargeRate = "Add the service charge amount.";
    }
  }

  if (form.vatType === "custom_amount") {
    const amount = Number(form.vatRate);

    if (!form.vatRate || Number.isNaN(amount) || amount < 0) {
      errors.vatRate = "Add the VAT amount.";
    }
  }

  return errors;
}

export function CreateEventForm({ formId }: { formId: string }) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<CreateEventErrors>({});
  const [isPending, setIsPending] = useState(false);

  function updateField<K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key] && !current.form) {
        return current;
      }

      return {
        ...current,
        [key]: undefined,
        form: undefined
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCreateEvent(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsPending(true);
    setErrors({});

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
      const message = payload.error?.message ?? "Unable to create the event.";
      setErrors((current) => ({ ...current, form: message }));
      setIsPending(false);
      return;
    }

    router.push(`/event/${payload.shareToken}/items`);
  }

  return (
    <form className="create-form" id={formId} noValidate onSubmit={handleSubmit}>
      <section className="create-card">
        <div className="create-card-glow" />
        <div className="stack" style={{ gap: 22, position: "relative", zIndex: 1 }}>
          <div className="field">
            <label htmlFor="title">What's the occasion?</label>
            <input
              aria-invalid={Boolean(errors.title)}
              className={errors.title ? "field-input-error" : undefined}
              id="title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Give this event a short name"
            />
            {errors.title ? <p className="field-error">{errors.title}</p> : null}
          </div>

          <div className="field">
            <label htmlFor="venue">Where to? (Optional)</label>
            <input
              id="venue"
              value={form.venueName}
              onChange={(event) => updateField("venueName", event.target.value)}
              placeholder="Add the venue if you already know it"
            />
          </div>

          <div className="field">
            <label htmlFor="hostName">Who's hosting?</label>
            <input
              aria-invalid={Boolean(errors.hostName)}
              className={errors.hostName ? "field-input-error" : undefined}
              id="hostName"
              value={form.hostName}
              onChange={(event) => updateField("hostName", event.target.value)}
              placeholder="What should everyone call the host?"
            />
            {errors.hostName ? <p className="field-error">{errors.hostName}</p> : null}
          </div>

          <div className="create-two-up">
            <div className="field">
              <label htmlFor="occurredDate">When?</label>
              <input
                aria-invalid={Boolean(errors.occurredDate)}
                className={errors.occurredDate ? "field-input-error" : undefined}
                id="occurredDate"
                type="date"
                value={form.occurredDate}
                onChange={(event) => updateField("occurredDate", event.target.value)}
              />
              {errors.occurredDate ? <p className="field-error">{errors.occurredDate}</p> : null}
            </div>
            <div className="field">
              <label htmlFor="occurredTime">Time</label>
              <input
                aria-invalid={Boolean(errors.occurredTime)}
                className={errors.occurredTime ? "field-input-error" : undefined}
                id="occurredTime"
                type="time"
                value={form.occurredTime}
                onChange={(event) => updateField("occurredTime", event.target.value)}
              />
              {errors.occurredTime ? <p className="field-error">{errors.occurredTime}</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="create-settings-card">
        <div className="toolbar">
          <h3 className="create-settings-title">Cost Settings</h3>
          <div className="create-currency-pill">
            <span>THB</span>
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
                  aria-invalid={Boolean(errors.serviceChargeRate)}
                  className={errors.serviceChargeRate ? "field-input-error" : undefined}
                  id="serviceChargeRate"
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.serviceChargeRate}
                  onChange={(event) => updateField("serviceChargeRate", event.target.value)}
                />
                {errors.serviceChargeRate ? (
                  <p className="field-error">{errors.serviceChargeRate}</p>
                ) : null}
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
                  aria-invalid={Boolean(errors.vatRate)}
                  className={errors.vatRate ? "field-input-error" : undefined}
                  id="vatRate"
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.vatRate}
                  onChange={(event) => updateField("vatRate", event.target.value)}
                />
                {errors.vatRate ? <p className="field-error">{errors.vatRate}</p> : null}
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

      {errors.form ? <div className="notice">{errors.form}</div> : null}
      {isPending ? <div className="notice">Creating your event...</div> : null}
    </form>
  );
}
