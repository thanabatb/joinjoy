import Link from "next/link";
import { HomeEventTabs } from "@/components/home/event-tabs";

const ongoingEvents = [
  {
    title: "Jazz Night at Jazz Bar",
    when: "Yesterday",
    href: "/event/jazz-night-demo/summary",
    accent: "jazz",
    status: "claiming",
    note: "Claims are still in progress."
  },
  {
    title: "Office Lunch",
    when: "Thursday",
    href: "/event/jazz-night-demo/summary",
    accent: "lunch",
    status: "joined",
    note: "Waiting for a few people to finish claiming."
  }
] as const;

const doneEvents = [
  {
    title: "BBQ Friday",
    when: "Last week",
    href: "/event/jazz-night-demo/host",
    accent: "bbq",
    status: "settled",
    note: "Fully cleared and ready to review."
  },
  {
    title: "Team Brunch",
    when: "Last month",
    href: "/event/jazz-night-demo/host",
    accent: "lunch",
    status: "finalized",
    note: "Final totals locked."
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

        <HomeEventTabs done={doneEvents} ongoing={ongoingEvents} />

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
