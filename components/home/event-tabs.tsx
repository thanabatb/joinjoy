"use client";

import Link from "next/link";
import { useState } from "react";

type HomeEvent = {
  title: string;
  when: string;
  href: string;
  accent: "jazz" | "lunch" | "bbq";
  status: "claiming" | "joined" | "finalized" | "settled";
  note: string;
};

function EventCard({ event }: { event: HomeEvent }) {
  return (
    <Link className="home-event-card" href={event.href}>
      <div className={`home-event-thumb ${event.accent}`} />
      <div className="stack" style={{ gap: 6, flex: 1 }}>
        <div className="home-event-heading">
          <strong>{event.title}</strong>
          <span className={`status-badge ${event.status}`}>{event.status}</span>
        </div>
        <span className="muted home-event-meta">{event.when}</span>
        <span className="home-event-note">{event.note}</span>
      </div>
    </Link>
  );
}

export function HomeEventTabs({
  done,
  ongoing
}: {
  done: readonly HomeEvent[];
  ongoing: readonly HomeEvent[];
}) {
  const [activeTab, setActiveTab] = useState<"ongoing" | "done">("ongoing");
  const events = activeTab === "ongoing" ? ongoing : done;

  return (
    <section className="stack" style={{ gap: 18 }}>
      <div className="toolbar">
        <h3 className="home-section-title">Your Events</h3>
        <Link className="home-inline-link" href="/event/jazz-night-demo/summary">
          Open latest
        </Link>
      </div>

      <div aria-label="Event groups" className="home-tab-row" role="tablist">
        <button
          aria-selected={activeTab === "ongoing"}
          className={activeTab === "ongoing" ? "home-tab active" : "home-tab"}
          onClick={() => setActiveTab("ongoing")}
          role="tab"
          type="button"
        >
          Ongoing
        </button>
        <button
          aria-selected={activeTab === "done"}
          className={activeTab === "done" ? "home-tab active" : "home-tab"}
          onClick={() => setActiveTab("done")}
          role="tab"
          type="button"
        >
          Done
        </button>
      </div>

      <div className="home-event-list">
        {events.map((event) => (
          <EventCard event={event} key={`${activeTab}-${event.title}-${event.when}`} />
        ))}
      </div>
    </section>
  );
}
