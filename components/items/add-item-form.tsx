"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const initialItem = {
  name: "",
  price: "0",
  quantity: "1",
  assignmentMode: "unclaimed"
};

export function AddItemForm({
  shareToken,
  variant = "default",
  formId,
  submitLabel
}: {
  shareToken: string;
  variant?: "default" | "page";
  formId?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialItem);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isPageVariant = variant === "page";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const response = await fetch(`/api/events/${shareToken}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity)
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error?.message ?? "Unable to add item.");
      setIsPending(false);
      return;
    }

    setForm(initialItem);
    setIsPending(false);
    router.refresh();
  }

  return (
    <form className={isPageVariant ? "add-expense-panel" : "card stack"} id={formId} onSubmit={handleSubmit}>
      {isPageVariant ? (
        <>
          <div className="add-expense-glow" />
          <div className="stack" style={{ gap: 22, position: "relative", zIndex: 1 }}>
            <h3 className="add-expense-title">
              <span className="add-expense-title-mark">+</span>
              New Item
            </h3>
            <div className="field">
              <label htmlFor="item-name-page">Item Name</label>
              <input
                id="item-name-page"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="What item should we add from the bill?"
                required
              />
            </div>
            <div className="create-two-up">
              <div className="field">
                <label htmlFor="item-price-page">Price</label>
                <div className="add-expense-price-wrap">
                  <span className="add-expense-price-prefix">THB</span>
                  <input
                    id="item-price-page"
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.price}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, price: event.target.value }))
                    }
                    placeholder="Enter item price"
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="item-quantity-page">Qty</label>
                <input
                  id="item-quantity-page"
                  min="1"
                  step="1"
                  type="number"
                  value={form.quantity}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, quantity: event.target.value }))
                  }
                  placeholder="How many?"
                />
              </div>
            </div>
            <button className="add-expense-add-button" disabled={isPending} type="submit">
              {isPending ? "Adding..." : submitLabel ?? "Add this item"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="toolbar">
            <h2 className="section-title">Add expense items</h2>
            <span className="eyebrow">Screen 4</span>
          </div>
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="item-name">Item name</label>
              <input
                id="item-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Add an item name from the bill"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="item-price">Price</label>
              <input
                id="item-price"
                min="0"
                step="0.01"
                type="number"
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="item-quantity">Quantity</label>
              <input
                id="item-quantity"
                min="1"
                step="1"
                type="number"
                value={form.quantity}
                onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
              />
            </div>
            <div className="field full">
              <label htmlFor="assignment-mode">Assignment mode</label>
              <select
                id="assignment-mode"
                value={form.assignmentMode}
                onChange={(event) =>
                  setForm((current) => ({ ...current, assignmentMode: event.target.value }))
                }
              >
                <option value="unclaimed">Unclaimed</option>
                <option value="claim_later">Claim later</option>
                <option value="shared_selected">Shared by selected people</option>
                <option value="host_assigned">Assigned by host</option>
              </select>
            </div>
          </div>
          <div className="button-row">
            <button className="button-secondary" disabled={isPending} type="submit">
              {isPending ? "Saving..." : submitLabel ?? "Add this item"}
            </button>
          </div>
        </>
      )}
      {error ? <div className="notice">{error}</div> : null}
    </form>
  );
}
