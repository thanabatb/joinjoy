import Link from "next/link";
import { HomeEventTabs } from "@/components/home/event-tabs";
import { listEvents } from "@/lib/repositories/events";
import type { Event } from "@/types/event";

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

function resolveAccent(event: Event) {
  const source = `${event.title} ${event.venueName ?? ""}`.toLowerCase();

  if (source.includes("jazz") || source.includes("bar")) {
    return "jazz" as const;
  }

  if (source.includes("bbq") || source.includes("grill")) {
    return "bbq" as const;
  }

  return "lunch" as const;
}

function formatWhen(occurredAt: string) {
  const date = new Date(occurredAt);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
}

function getEventNote(event: Event) {
  switch (event.status) {
    case "draft":
      return "Ready for the host to add bill items.";
    case "claiming":
      return "Claims are still in progress.";
    case "needs_review":
      return "A few items still need review.";
    case "finalized":
      return "Final totals are locked and awaiting settlement.";
    case "settled":
      return "Fully cleared and ready to review.";
    default:
      return "Open the event to continue.";
  }
}

function getEventHref(event: Event) {
  return `/event/${event.shareToken}/summary`;
}

export default async function HomePage() {
  const events = await listEvents();
  const latestHref = events[0] ? getEventHref(events[0]) : undefined;
  const ongoingEvents = events
    .filter((event) => event.status !== "settled")
    .map((event) => {
      const status = event.status === "finalized" ? ("finalized" as const) : ("claiming" as const);

      return {
        title: event.title,
        when: formatWhen(event.occurredAt),
        href: getEventHref(event),
        accent: resolveAccent(event),
        status,
        note: getEventNote(event)
      };
    });
  const doneEvents = events
    .filter((event) => event.status === "settled")
    .map((event) => ({
      title: event.title,
      when: formatWhen(event.occurredAt),
      href: getEventHref(event),
      accent: resolveAccent(event),
      status: "settled" as const,
      note: getEventNote(event)
    }));

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
              <Link
                className="button-secondary home-button-secondary"
                href={latestHref ?? "/create"}
              >
                Join Event
              </Link>
            </div>
          </div>
        </section>

        <HomeEventTabs done={doneEvents} latestHref={latestHref} ongoing={ongoingEvents} />

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
        <Link className="home-nav-item" href={latestHref ?? "/create"}>
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
