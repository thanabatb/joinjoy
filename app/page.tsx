import Link from "next/link";
import { getEventOverviewByShareToken } from "@/lib/repositories/events";
import { formatCurrency } from "@/lib/utils/currency";

const recentEvents = [
  {
    title: "Jazz Night at Jazz Bar",
    when: "Yesterday",
    direction: "You owe",
    amount: 42,
    tone: "owed",
    accent: "jazz"
  },
  {
    title: "Office Lunch",
    when: "Thursday",
    direction: "You're owed",
    amount: 15.5,
    tone: "owed-to-you",
    accent: "lunch"
  },
  {
    title: "BBQ Friday",
    when: "Last week",
    direction: "Settled",
    amount: 0,
    tone: "settled",
    accent: "bbq"
  }
] as const;

const howItWorks = [
  {
    step: "1",
    title: "Create or join an event",
    description: "Start a session with your group in seconds through a simple invite link."
  },
  {
    step: "2",
    title: "Claim what you had",
    description: "Tap the items you consumed instead of forcing the host to remember every detail."
  },
  {
    step: "3",
    title: "Split shared costs fairly",
    description: "Shared dishes, service charge, and VAT are distributed consistently without side math."
  }
] as const;

export default function HomePage() {
  const demoEvent = getEventOverviewByShareToken("jazz-night-demo");
  const liveAmount = demoEvent ? formatCurrency(demoEvent.totalAmount, demoEvent.currency) : "$0.00";

  return (
    <>
      <main className="page-shell home-page">
        <nav className="home-topbar">
          <div className="brand-lockup">
            <span className="brand-mark">J</span>
            <span className="brand-name">JoinJoy</span>
          </div>
          <div className="profile-pill" aria-label="Current profile">
            TB
          </div>
        </nav>

        <section className="home-hero">
          <div className="hero-orb hero-orb-primary" />
          <div className="hero-orb hero-orb-tertiary" />
          <div className="stack home-hero-content">
            <h1 className="home-title">
              Claim what you had.
              <br />
              <span>Split with joy.</span>
            </h1>
            <p className="home-subtitle">
              The joyful way to share expenses without the usual “who owes what” headache.
            </p>
            <div className="home-actions">
              <Link className="button home-button-primary" href="/create">
                Create Event
              </Link>
              <Link className="button-secondary home-button-secondary" href="/event/jazz-night-demo">
                Join Event
              </Link>
            </div>
          </div>
        </section>

        <section className="home-summary-shell">
          <div className="home-summary-card">
            <div className="toolbar">
              <div className="stack" style={{ gap: 6 }}>
                <p className="summary-kicker">Ongoing balance</p>
                <h2 className="home-summary-amount">{liveAmount}</h2>
              </div>
              <span className="status-badge claiming">Splitting in progress</span>
            </div>
            <div className="grid-2">
              <div className="home-mini-stat">
                <div className="home-mini-icon">P</div>
                <div>
                  <p className="home-mini-label">Participants</p>
                  <p className="home-mini-value">{demoEvent?.participantCount ?? 0}</p>
                </div>
              </div>
              <div className="home-mini-stat">
                <div className="home-mini-icon">I</div>
                <div>
                  <p className="home-mini-label">Items</p>
                  <p className="home-mini-value">{demoEvent?.itemCount ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="home-summary-badge">+</div>
        </section>

        <section className="stack" style={{ gap: 18 }}>
          <div className="toolbar">
            <h3 className="home-section-title">Your Events</h3>
            <Link className="home-inline-link" href="/event/jazz-night-demo">
              View all
            </Link>
          </div>
          <div className="home-event-list">
            {recentEvents.map((event) => (
              <Link
                className="home-event-card"
                href="/event/jazz-night-demo"
                key={`${event.title}-${event.when}`}
              >
                <div className={`home-event-thumb ${event.accent}`} />
                <div className="stack" style={{ gap: 4, flex: 1 }}>
                  <strong>{event.title}</strong>
                  <span className="muted home-event-meta">{event.when}</span>
                </div>
                <div className="home-event-amount">
                  {event.tone === "settled" ? (
                    <span className="home-settled-badge">Settled</span>
                  ) : (
                    <>
                      <span className="muted home-event-meta">{event.direction}</span>
                      <strong className={event.tone === "owed" ? "home-owed" : "home-owed-to-you"}>
                        {formatCurrency(event.amount, "USD")}
                      </strong>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-steps">
          <div className="stack" style={{ gap: 8, textAlign: "center" }}>
            <h3 className="home-section-title">The Joy of Splitting</h3>
            <p className="muted">Simple as one, two, tea.</p>
          </div>
          <div className="stack" style={{ gap: 28 }}>
            {howItWorks.map((item, index) => (
              <div className="home-step-row" key={item.step}>
                <div className={`home-step-badge tone-${index + 1}`}>{item.step}</div>
                <div className="stack" style={{ gap: 6 }}>
                  <strong>{item.title}</strong>
                  <p className="muted" style={{ margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-bottom-nav">
        <div className="home-nav-item active">
          <span>Home</span>
        </div>
        <Link className="home-nav-item" href="/event/jazz-night-demo">
          <span>Events</span>
        </Link>
        <div className="home-nav-item">
          <span>Alerts</span>
        </div>
        <div className="home-nav-item">
          <span>Profile</span>
        </div>
      </footer>
    </>
  );
}
