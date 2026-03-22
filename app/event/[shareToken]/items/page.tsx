import Link from "next/link";
import { notFound } from "next/navigation";
import { HistoryBackButton } from "@/components/common/history-back-button";
import { AddItemForm } from "@/components/items/add-item-form";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { listItemsByShareToken } from "@/lib/repositories/items";
import { formatCurrency } from "@/lib/utils/currency";
import { formatEventDate } from "@/lib/utils/dates";

function getItemAccent(name: string) {
  const value = name.toLowerCase();

  if (value.includes("beer") || value.includes("cocktail") || value.includes("negroni")) {
    return { symbol: "Dr", tone: "drink" };
  }

  if (value.includes("water")) {
    return { symbol: "Wt", tone: "water" };
  }

  return { symbol: "Fd", tone: "food" };
}

export default async function AddExpensesPage({
  params
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  const event = await getEventOverviewByShareToken(shareToken);

  if (!event) {
    notFound();
  }

  const items = await listItemsByShareToken(shareToken);
  const unresolvedItems = items.filter((item) => item.status === "unclaimed" || item.status === "partial");

  return (
    <>
      <main className="page-shell add-items-page">
        <header className="add-items-topbar">
          <div className="add-items-topbar-row">
            <HistoryBackButton
              ariaLabel="Go back"
              className="create-back"
              fallbackHref={`/event/${shareToken}/summary`}
            >
              <span>←</span>
            </HistoryBackButton>
            <h1 className="add-items-topbar-title">Add Expenses</h1>
          </div>
          <button className="add-items-more" type="button">
            ⋯
          </button>
        </header>

        <section className="add-items-context">
          <div className="add-items-context-main">
            <div className="add-items-context-icon">♪</div>
            <div className="stack" style={{ gap: 4 }}>
              <h2 className="add-items-context-title">{event.title}</h2>
              <p className="muted add-items-context-meta">
                {event.venueName || "Venue pending"}
              </p>
            </div>
          </div>
          <div className="add-items-date-badge">
            {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
              new Date(event.occurredAt)
            )}
          </div>
        </section>

        <section className="stack" style={{ gap: 18 }}>
          <AddItemForm shareToken={shareToken} submitLabel="Add to List" variant="page" />
        </section>

        <section className="stack" style={{ gap: 16 }}>
          <div className="toolbar add-items-list-header">
            <h3 className="add-items-list-title">Unclaimed Items</h3>
            <span className="add-items-count-badge">{unresolvedItems.length} items</span>
          </div>

          <div className="add-items-list">
            {unresolvedItems.map((item) => (
              <article className="add-items-list-card" key={item.id}>
                <div className="add-items-list-main">
                  <div className={`add-items-list-icon ${getItemAccent(item.name).tone}`}>
                    <strong>{getItemAccent(item.name).symbol}</strong>
                    <span>{item.quantity}</span>
                  </div>
                  <div className="stack" style={{ gap: 4 }}>
                    <strong>{item.name}</strong>
                    <span className="muted add-items-list-meta">
                      {item.assignmentMode === "shared_selected"
                        ? "Shared between guests"
                        : item.assignmentMode === "claim_later"
                          ? "Waiting for claim"
                          : "Ready to assign"}
                    </span>
                  </div>
                </div>
                <div className="add-items-list-amount">
                  <strong>{formatCurrency(item.totalPrice, event.currency)}</strong>
                  <span className="add-items-unclaimed-pill">
                    {item.status === "partial" ? "Partial" : "Unclaimed"}
                  </span>
                </div>
              </article>
            ))}

            <div className="add-items-empty-card">
              <span className="add-items-empty-icon">[]</span>
              <p>More items?</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="add-items-footer">
        <div className="stack" style={{ gap: 12 }}>
          <Link className="button add-items-footer-button" href={`/event/${shareToken}/summary`}>
            Review Event
          </Link>
          <Link className="add-items-cancel" href={`/event/${shareToken}/summary`}>
            Cancel
          </Link>
        </div>
      </footer>
    </>
  );
}
